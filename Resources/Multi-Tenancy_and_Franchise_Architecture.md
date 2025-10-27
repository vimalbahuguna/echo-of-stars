# Multi-Tenancy and Franchise Architecture

This document describes how to manage tenants, franchisees, users, and data in the system. It captures the current schema, RLS strategy, roles, operational flows, and examples to guide backend and product teams.

## Core Model

- Tenants: top-level isolation using `public.tenants` with `id`, `slug`, and `status`.
- Organizations: hierarchical units under a tenant using `public.organizations` with `parent_organization_id` and `type` (`headquarters`, `franchise`, `branch`, `partner`).
- Users: `public.profiles` store `tenant_id`, `organization_id`, and `role` (`super_admin`, `tenant_admin`, `organization_admin`, `franchise_admin`, `manager`, `end_user`).
- Data: every business table stores `tenant_id` and `organization_id`, indexed and constrained with FKs to `tenants` and `organizations`.

## Identity & Roles

- `super_admin`: platform-wide; use sparingly and always audited.
- `tenant_admin`: full control within one tenant; creates orgs and assigns roles.
- `organization_admin`: manages only within assigned organization.
- `franchise_admin`: manages across an organization subtree (franchise HQ and all child branches).
- `end_user`: limited to their own records (e.g., student sees their progress).

## Access Control (RLS)

- RLS is enabled on data tables; policies scope by `tenant_id`, `organization_id`, and user role:
  - Admin policies enforce `(tenant_id = get_current_user_tenant_id())` and appropriate org checks.
  - Franchise admins use `is_in_current_org_subtree(organization_id)` to manage across their branches.
  - End users read or update only their own records using email→student linkage.
- `service_role` policies are present for backend tasks; do not use in client apps.

### Subtree Helper

- `public.is_in_current_org_subtree(target_org_id UUID) RETURNS BOOLEAN`: returns `true` if `target_org_id` is the current user’s org or any descendant via `parent_organization_id`.

## Operational Flows

- Onboard Tenant:
  - Create a tenant record; optionally seed a root organization (`type='headquarters'`).
  - Assign `tenant_admin` users in `profiles`.
- Add Franchisee:
  - Create an organization under the HQ with `type='franchise'` and `parent_organization_id` pointing to HQ.
  - Assign franchise staff (`franchise_admin`, `manager`, `end_user`) with `organization_id` set.
- Data Creation:
  - For every new table: add `tenant_id` and `organization_id` columns, FKs, and indexes; enable RLS; add admin/user policies mirroring existing ones.
  - Use RPCs that auto-fill `tenant_id`/`organization_id` from actor or target entity to keep data consistent.
- Backfill Legacy:
  - Map existing rows via `profiles.email → stu_students.email` to set `tenant_id`/`organization_id`.
  - Verify no cross-tenant contamination before marking columns `NOT NULL`.

## Franchisee Management

- Structure franchises as organizations of `type='franchise'` under the tenant’s HQ.
- Assign `franchise_admin` at the HQ (or franchise root); their rights span the organization subtree.
- Policies allow franchise admins to manage students, enrollments, progress, and feedback where `organization_id` is within their subtree.

## API & RPC

- `public.progress_update_week(...) RETURNS public.stu_progress`
  - Parameters: `p_student_id BIGINT DEFAULT NULL`, `p_week_id BIGINT`, `p_completion NUMERIC(5,2) DEFAULT NULL`, `p_status public.stu_progress_status_enum DEFAULT NULL`, `p_notes TEXT DEFAULT NULL`, `p_started_date DATE DEFAULT NULL`, `p_completed_date DATE DEFAULT NULL`.
  - Behavior:
    - If `p_student_id` is `NULL`, resolves the current user’s `student_id` by matching `profiles.email` to `stu_students.email`.
    - Enforces permissions:
      - `end_user`: can only update their own `student_id`.
      - `organization_admin`: must match their `organization_id`.
      - `franchise_admin`: must be within their org subtree (`is_in_current_org_subtree`).
      - All admins: tenant must match `get_current_user_tenant_id()`.
    - Upserts `stu_progress` on `(student_id, week_id)`.
    - Auto-fills `tenant_id` and `organization_id` from the target student or the actor context if missing.

### Example Calls

```sql
-- Student updates own weekly progress
SELECT * FROM public.progress_update_week(
  NULL, -- resolve student_id from current user
  12345, -- week_id
  75.00,
  'In Progress',
  'Working on pranayama',
  '2025-10-20',
  NULL
);

-- Admin updates a specific student (must satisfy tenant/org constraints)
SELECT * FROM public.progress_update_week(
  987654, -- student_id
  12345,  -- week_id
  100.00,
  'Completed',
  'Great progress',
  '2025-10-20',
  '2025-10-27'
);
```

## Governance

- Auditing: log admin actions; add `updated_at` triggers to key tables; track who changed what via RPC metadata where feasible.
- Least privilege: default everyone to `end_user`; elevate via explicit admin processes.
- Service keys: limit to server-side workloads; rotate frequently; never expose to clients.
- Testing: verify RLS behavior per role using sample users in a staging environment.

## Quick SQL Examples

```sql
-- Create a franchise organization under an HQ
INSERT INTO public.organizations (tenant_id, parent_organization_id, name, type)
VALUES ('<tenant_id>', '<hq_org_id>', 'Franchise A', 'franchise');

-- Assign a user to franchise admin
UPDATE public.profiles
SET role = 'franchise_admin', organization_id = '<franchise_org_id>'
WHERE id = '<user_id>';
```

## Checklist

- Add `tenant_id`/`organization_id` to every new table and index them.
- Enable RLS and mirror admin/user policies from existing academy tables.
- Use `get_current_user_*()` helpers and `is_in_current_org_subtree()` in policies.
- Route mutations through secure RPCs that enforce role and scope, auto-fill IDs.
- Run backfills immediately after adding multitenancy columns for legacy data.
- Validate dashboards with sample users for each role to ensure RLS holds.