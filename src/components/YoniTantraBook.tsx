import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Book, 
  BookOpen, 
  Search, 
  Bookmark, 
  Heart, 
  Star, 
  Crown, 
  Flame,
  Eye,
  Flower2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  Pause
} from 'lucide-react';
import { MantraAudioControls } from './MantraAudioControls';

interface YoniTantraPatala {
  id: number;
  title: string;
  sanskritTitle: string;
  verses: number;
  description: string;
  keyTopics: string[];
  mantras: {
    sanskrit: string;
    transliteration: string;
    meaning: string;
  }[];
  content: {
    introduction: string;
    verses: {
      number: number;
      sanskrit: string;
      transliteration: string;
      translation: string;
      commentary: string;
    }[];
    conclusion: string;
  };
}

interface YoniTantraBookProps {
  onBack?: () => void;
}

const YoniTantraBook: React.FC<YoniTantraBookProps> = ({ onBack }) => {
  const [currentPatala, setCurrentPatala] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedPatalas, setBookmarkedPatalas] = useState<number[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Complete Yoni Tantra structure with all 8 patalas
  const yoniTantraPatalas: YoniTantraPatala[] = [
    {
      id: 1,
      title: "Introduction to Yoni Tantra",
      sanskritTitle: "योनि तन्त्र प्रारम्भ",
      verses: 25,
      description: "The foundational chapter introducing the sacred nature of the Yoni and its worship",
      keyTopics: ["Sacred Feminine", "Tantric Philosophy", "Yoni Worship", "Divine Mother"],
      mantras: [
        {
          sanskrit: "ॐ ह्रीं श्रीं क्लीं परमेश्वरि स्वाहा",
          transliteration: "Om Hrīṃ Śrīṃ Klīṃ Parameśvari Svāhā",
          meaning: "Salutations to the Supreme Divine Mother, the source of all creation"
        }
      ],
      content: {
        introduction: "The Yoni Tantra begins with Lord Shiva explaining to Parvati the supreme importance of Yoni worship. This sacred text reveals the mystical significance of the feminine principle in creation and spiritual realization.",
        verses: [
          {
            number: 1,
            sanskrit: "श्री भैरव उवाच। देवि त्वं सर्वभूतानां योनिर्मूलं सनातनम्।",
            transliteration: "Śrī Bhairava uvāca | Devi tvaṃ sarvabhūtānāṃ yonirmūlaṃ sanātanam |",
            translation: "Lord Bhairava said: O Goddess, you are the eternal source and womb of all beings.",
            commentary: "This opening verse establishes the fundamental principle that the Divine Feminine is the source of all creation. The word 'Yoni' here represents not just the physical aspect but the cosmic womb from which all existence emerges."
          },
          {
            number: 2,
            sanskrit: "योनिपूजां विना देवि न सिद्धिर्जायते क्वचित्।",
            transliteration: "Yonipūjāṃ vinā devi na siddhirjāyate kvacit |",
            translation: "O Goddess, without Yoni worship, no spiritual accomplishment can be achieved anywhere.",
            commentary: "This verse emphasizes that recognizing and honoring the feminine principle is essential for any spiritual progress. It's not merely ritual worship but a deep acknowledgment of the creative force."
          },
          {
            number: 3,
            sanskrit: "योनिमण्डलमध्यस्थे कामबीजं समुच्चरेत्।",
            transliteration: "Yonimaṇḍalamadhyasthe kāmabījaṃ samuccaret |",
            translation: "In the center of the Yoni mandala, one should recite the seed mantra of desire.",
            commentary: "This introduces the practice of mantra recitation within the sacred geometric representation of the Yoni, connecting sound vibration with the feminine principle."
          }
        ],
        conclusion: "This patala establishes the theological foundation for Yoni worship as a path to spiritual realization and cosmic understanding."
      }
    },
    {
      id: 2,
      title: "The Sacred Yoni Mandala",
      sanskritTitle: "पवित्र योनि मण्डल",
      verses: 30,
      description: "Detailed description of the Yoni mandala, its construction, and symbolic meanings",
      keyTopics: ["Sacred Geometry", "Mandala Construction", "Symbolic Meanings", "Ritual Preparation"],
      mantras: [
        {
          sanskrit: "ॐ ऐं ह्रीं श्रीं योनिमण्डलाय नमः",
          transliteration: "Om Aiṃ Hrīṃ Śrīṃ Yonimaṇḍalāya Namaḥ",
          meaning: "Salutations to the sacred Yoni mandala, the geometric representation of divine creation"
        }
      ],
      content: {
        introduction: "This patala provides detailed instructions for creating and understanding the Yoni mandala, a sacred geometric form that represents the cosmic feminine principle.",
        verses: [
          {
            number: 4,
            sanskrit: "त्रिकोणं योनिरूपं च बिन्दुना सहितं शुभम्।",
            transliteration: "Trikoṇaṃ yonirūpaṃ ca bindunā sahitaṃ śubham |",
            translation: "The auspicious triangle representing the Yoni form, together with the central point (bindu).",
            commentary: "The triangle pointing downward represents the Yoni, while the bindu (point) in the center represents the source of creation. This geometric form encapsulates the entire process of manifestation."
          },
          {
            number: 5,
            sanskrit: "रक्तवर्णं समुद्दिश्य कुङ्कुमेन विलेपयेत्।",
            transliteration: "Raktavarṇaṃ samuddiśya kuṅkumena vilepayed |",
            translation: "It should be painted in red color, anointed with kumkum (vermillion).",
            commentary: "Red symbolizes the life force, passion, and the creative energy of the Divine Mother. Kumkum is considered especially sacred to the Goddess."
          }
        ],
        conclusion: "The Yoni mandala serves as both a meditation tool and a sacred space for worship, connecting the practitioner with cosmic feminine energy."
      }
    },
    {
      id: 3,
      title: "Yoni Puja Rituals",
      sanskritTitle: "योनि पूजा विधि",
      verses: 40,
      description: "Complete ritual procedures for Yoni worship including offerings and ceremonies",
      keyTopics: ["Ritual Procedures", "Sacred Offerings", "Ceremonial Worship", "Purification Rites"],
      mantras: [
        {
          sanskrit: "ॐ श्रीं ह्रीं क्लीं ग्लौं गं गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा",
          transliteration: "Om Śrīṃ Hrīṃ Klīṃ Glauṃ Gaṃ Gaṇapataye Vara Varada Sarvajaṃ Me Vaśamānaya Svāhā",
          meaning: "Invocation to Lord Ganesha for removing obstacles in the sacred worship"
        }
      ],
      content: {
        introduction: "This chapter details the complete ritual procedures for Yoni worship, including purification, invocation, offerings, and concluding ceremonies.",
        verses: [
          {
            number: 15,
            sanskrit: "स्नानं कृत्वा शुचिर्भूत्वा शुक्लवस्त्रं समावृतः।",
            transliteration: "Snānaṃ kṛtvā śucirbhūtvā śuklavastraṃ samāvṛtaḥ |",
            translation: "After bathing and becoming pure, clothed in white garments.",
            commentary: "Purification is the first step in any sacred ritual. White clothing represents purity and spiritual aspiration."
          }
        ],
        conclusion: "These rituals create a sacred space and mindset for connecting with the Divine Feminine principle."
      }
    },
    {
      id: 4,
      title: "The Ten Mahavidyas and Yoni",
      sanskritTitle: "दश महाविद्या योनि सम्बन्ध",
      verses: 35,
      description: "Connection between the ten great wisdom goddesses and Yoni worship",
      keyTopics: ["Mahavidyas", "Goddess Worship", "Tantric Deities", "Divine Feminine Forms"],
      mantras: [
        {
          sanskrit: "ॐ ह्रीं श्रीं क्लीं दुर्गायै नमः",
          transliteration: "Om Hrīṃ Śrīṃ Klīṃ Durgāyai Namaḥ",
          meaning: "Salutations to Goddess Durga, the supreme protector and divine mother"
        }
      ],
      content: {
        introduction: "This patala explores the relationship between the ten Mahavidyas (great wisdom goddesses) and the principle of Yoni worship.",
        verses: [
          {
            number: 20,
            sanskrit: "काली तारा महाविद्या षोडशी भुवनेश्वरी।",
            transliteration: "Kālī Tārā Mahāvidyā Ṣoḍaśī Bhuvaneśvarī |",
            translation: "Kali, Tara, Mahavidya, Shodashi, and Bhuvaneshvari.",
            commentary: "These are five of the ten Mahavidyas, each representing different aspects of the Divine Feminine and different approaches to spiritual realization."
          }
        ],
        conclusion: "Each Mahavidya represents a unique aspect of the cosmic feminine principle accessible through Yoni worship."
      }
    },
    {
      id: 5,
      title: "Yoni Yantra and Sacred Geometry",
      sanskritTitle: "योनि यन्त्र पवित्र ज्यामिति",
      verses: 28,
      description: "Sacred geometric patterns, yantras, and their spiritual significance in Yoni worship",
      keyTopics: ["Sacred Geometry", "Yantra Construction", "Geometric Meditation", "Cosmic Patterns"],
      mantras: [
        {
          sanskrit: "ॐ श्रीं ह्रीं क्लीं यन्त्राय नमः",
          transliteration: "Om Śrīṃ Hrīṃ Klīṃ Yantrāya Namaḥ",
          meaning: "Salutations to the sacred yantra, the geometric form of divine energy"
        }
      ],
      content: {
        introduction: "This chapter delves into the sacred geometric patterns associated with Yoni worship and their use in meditation and ritual.",
        verses: [
          {
            number: 25,
            sanskrit: "यन्त्रराजं महापुण्यं सर्वकामप्रदायकम्।",
            transliteration: "Yantrarājaṃ mahāpuṇyaṃ sarvakāmapradāyakam |",
            translation: "The king of yantras, greatly auspicious, granting all desires.",
            commentary: "The Yoni yantra is considered the supreme geometric form, capable of fulfilling all spiritual and material aspirations when approached with proper devotion."
          }
        ],
        conclusion: "Sacred geometry serves as a bridge between the physical and spiritual realms in Yoni worship."
      }
    },
    {
      id: 6,
      title: "Mantras and Sound Vibrations",
      sanskritTitle: "मन्त्र ध्वनि कम्पन",
      verses: 45,
      description: "Sacred mantras, their pronunciation, and vibrational effects in Yoni worship",
      keyTopics: ["Sacred Mantras", "Sound Vibration", "Pronunciation", "Spiritual Effects"],
      mantras: [
        {
          sanskrit: "ॐ ऐं ह्रीं श्रीं क्लीं सौः",
          transliteration: "Om Aiṃ Hrīṃ Śrīṃ Klīṃ Sauḥ",
          meaning: "The complete seed mantra invoking all aspects of divine feminine energy"
        }
      ],
      content: {
        introduction: "This patala focuses on the power of sacred sound and specific mantras used in Yoni worship for spiritual transformation.",
        verses: [
          {
            number: 30,
            sanskrit: "मन्त्रराजो महामन्त्रः सर्वसिद्धिप्रदायकः।",
            transliteration: "Mantrarājo mahāmantraḥ sarvasiddhipradāyakaḥ |",
            translation: "The king of mantras, the great mantra, granter of all accomplishments.",
            commentary: "Certain mantras are considered especially powerful in Yoni worship, capable of awakening dormant spiritual energies and granting various siddhis (spiritual powers)."
          }
        ],
        conclusion: "Sacred sound vibrations create resonance with cosmic feminine energy, facilitating spiritual awakening."
      }
    },
    {
      id: 7,
      title: "Meditation and Visualization",
      sanskritTitle: "ध्यान दर्शन",
      verses: 32,
      description: "Meditation techniques and visualization practices for Yoni worship",
      keyTopics: ["Meditation Techniques", "Visualization", "Contemplative Practices", "Inner Worship"],
      mantras: [
        {
          sanskrit: "ॐ ध्यानमूर्तये नमः",
          transliteration: "Om Dhyānamūrtaye Namaḥ",
          meaning: "Salutations to the form of meditation, the divine presence within"
        }
      ],
      content: {
        introduction: "This chapter provides detailed meditation and visualization techniques for deepening one's connection with the Divine Feminine through Yoni worship.",
        verses: [
          {
            number: 35,
            sanskrit: "ध्यानेन योनिरूपं च चिन्तयेत्सततं मुनिः।",
            transliteration: "Dhyānena yonirūpaṃ ca cintayetsatataṃ muniḥ |",
            translation: "Through meditation, the sage should constantly contemplate the form of the Yoni.",
            commentary: "Continuous meditation on the Yoni form leads to direct realization of the creative principle underlying all existence."
          }
        ],
        conclusion: "Meditation and visualization transform external worship into internal realization of divine truth."
      }
    },
    {
      id: 8,
      title: "Spiritual Attainments and Siddhis",
      sanskritTitle: "आध्यात्मिक सिद्धि प्राप्ति",
      verses: 38,
      description: "Spiritual powers and attainments gained through sincere Yoni worship",
      keyTopics: ["Spiritual Powers", "Divine Attainments", "Mystical Experiences", "Liberation"],
      mantras: [
        {
          sanskrit: "ॐ सिद्धिदात्र्यै नमः",
          transliteration: "Om Siddhidātryai Namaḥ",
          meaning: "Salutations to the giver of spiritual accomplishments and divine powers"
        }
      ],
      content: {
        introduction: "The final patala describes the various spiritual attainments and mystical experiences that arise from dedicated Yoni worship practice.",
        verses: [
          {
            number: 40,
            sanskrit: "योनिपूजारतो नित्यं सर्वसिद्धिमवाप्नुयात्।",
            transliteration: "Yonipūjārato nityaṃ sarvasiddhimavāpnuyāt |",
            translation: "One who is constantly devoted to Yoni worship attains all spiritual accomplishments.",
            commentary: "This concluding verse emphasizes that consistent and devoted practice of Yoni worship leads to the highest spiritual realizations and mystical powers."
          }
        ],
        conclusion: "Through sincere Yoni worship, the practitioner transcends ordinary consciousness and realizes their divine nature."
      }
    }
  ];

  const toggleBookmark = (patalaId: number) => {
    setBookmarkedPatalas(prev => 
      prev.includes(patalaId) 
        ? prev.filter(id => id !== patalaId)
        : [...prev, patalaId]
    );
  };

  const filteredPatalas = yoniTantraPatalas.filter(patala =>
    patala.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patala.sanskritTitle.includes(searchTerm) ||
    patala.keyTopics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentPatalaDat = yoniTantraPatalas[currentPatala];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-2 border-purple-200 shadow-xl bg-gradient-to-r from-purple-100 to-pink-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {onBack && (
                  <Button onClick={onBack} variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <div className="flex items-center space-x-3">
                  <Book className="h-8 w-8 text-purple-600 animate-pulse" />
                  <div>
                    <CardTitle className="text-2xl text-purple-800">
                      योनि तन्त्र - Yoni Tantra
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                      The Sacred Text of Divine Feminine Worship
                    </CardDescription>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                {yoniTantraPatalas.length} Patalas
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Chapter Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-2 border-pink-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-pink-800">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Patalas (Chapters)
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search chapters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {filteredPatalas.map((patala, index) => (
                      <div key={patala.id} className="space-y-2">
                        <Button
                          variant={currentPatala === index ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPatala(index)}
                          className={`w-full justify-start text-left p-3 h-auto ${
                            currentPatala === index 
                              ? 'bg-purple-600 text-white' 
                              : 'border-purple-200 hover:bg-purple-50'
                          }`}
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex-1">
                              <div className="font-semibold text-sm">
                                Patala {patala.id}
                              </div>
                              <div className="text-xs opacity-90 mt-1">
                                {patala.title}
                              </div>
                              <div className="text-xs opacity-75 mt-1">
                                {patala.sanskritTitle}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(patala.id);
                              }}
                              className="p-1 h-auto"
                            >
                              <Bookmark 
                                className={`h-3 w-3 ${
                                  bookmarkedPatalas.includes(patala.id) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-400'
                                }`} 
                              />
                            </Button>
                          </div>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-orange-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-orange-800 flex items-center">
                      <Crown className="h-6 w-6 mr-2" />
                      Patala {currentPatalaDat.id}: {currentPatalaDat.title}
                    </CardTitle>
                    <CardDescription className="text-orange-600 mt-2">
                      {currentPatalaDat.sanskritTitle} • {currentPatalaDat.verses} Verses
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPatala(Math.max(0, currentPatala - 1))}
                      disabled={currentPatala === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPatala(Math.min(yoniTantraPatalas.length - 1, currentPatala + 1))}
                      disabled={currentPatala === yoniTantraPatalas.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
                        <Eye className="h-5 w-5 mr-2" />
                        Chapter Overview
                      </h3>
                      <p className="text-gray-700">{currentPatalaDat.description}</p>
                    </div>

                    {/* Key Topics */}
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <Star className="h-5 w-5 mr-2" />
                        Key Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentPatalaDat.keyTopics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Sacred Mantras */}
                    <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <h3 className="font-semibold text-pink-800 mb-4 flex items-center">
                        <Flower2 className="h-5 w-5 mr-2" />
                        Sacred Mantras
                      </h3>
                      {currentPatalaDat.mantras.map((mantra, index) => (
                        <div key={index} className="mb-4 last:mb-0">
                          <MantraAudioControls
                            mantra={mantra}
                            stepNumber={currentPatala + 1}
                            className="bg-white/70"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Introduction */}
                    <div>
                      <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Introduction
                      </h3>
                      <p className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        {currentPatalaDat.content.introduction}
                      </p>
                    </div>

                    {/* Verses */}
                    <div>
                      <h3 className="font-semibold text-green-800 mb-4 flex items-center">
                        <Flame className="h-5 w-5 mr-2" />
                        Sacred Verses
                      </h3>
                      <div className="space-y-6">
                        {currentPatalaDat.content.verses.map((verse, index) => (
                          <Card key={index} className="border border-green-200 bg-green-50/50">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-3">
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                  Verse {verse.number}
                                </Badge>
                              </div>
                              
                              <div className="space-y-3">
                                {/* Sanskrit */}
                                <div>
                                  <h5 className="font-medium text-green-800 mb-1">Sanskrit:</h5>
                                  <p className="text-lg font-sanskrit text-green-900 bg-white/70 p-3 rounded border">
                                    {verse.sanskrit}
                                  </p>
                                </div>
                                
                                {/* Transliteration */}
                                <div>
                                  <h5 className="font-medium text-green-800 mb-1">Transliteration:</h5>
                                  <p className="italic text-green-700 bg-white/70 p-3 rounded border">
                                    {verse.transliteration}
                                  </p>
                                </div>
                                
                                {/* Translation */}
                                <div>
                                  <h5 className="font-medium text-green-800 mb-1">Translation:</h5>
                                  <p className="text-green-900 bg-white/70 p-3 rounded border">
                                    {verse.translation}
                                  </p>
                                </div>
                                
                                {/* Commentary */}
                                <div>
                                  <h5 className="font-medium text-green-800 mb-1">Commentary:</h5>
                                  <p className="text-gray-700 bg-white/70 p-3 rounded border leading-relaxed">
                                    {verse.commentary}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Conclusion */}
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Conclusion
                      </h3>
                      <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-lg border border-purple-200">
                        {currentPatalaDat.content.conclusion}
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoniTantraBook;