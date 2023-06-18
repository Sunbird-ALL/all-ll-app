//assests
import leena_audio from "../../assests/Audio/leena_audio.m4a";
import long_para from "../../assests/Audio/long_para.m4a";

//audio content
import a1_en from "../../assests/Audio/Content/a1_en.m4a";
import a1_ta from "../../assests/Audio/Content/a1_ta.mpga";
import a1_hi from "../../assests/Audio/Content/a1_hi.m4a";
import a2_en from "../../assests/Audio/Content/a2_en.m4a";
import a2_ta from "../../assests/Audio/Content/a2_ta.mpga";
import a2_hi from "../../assests/Audio/Content/a2_hi.m4a";
import a3_en from "../../assests/Audio/Content/a3_en.m4a";
import a3_ta from "../../assests/Audio/Content/a3_ta.mpga";
import a3_hi from "../../assests/Audio/Content/a3_hi.m4a";

//image content
import p1 from "../../assests/Images/Content/p1.png";
import p2 from "../../assests/Images/Content/p2.jpeg";
import p3 from "../../assests/Images/Content/p3.jpeg";

const content_list = [
  {
    title: "Word",
    en: "Cat",
    ta: "பூனை",
    hi: "बिल्ली",
    en_audio: a1_en,
    ta_audio: a1_ta,
    hi_audio: a1_hi,
    image: p1,
  },
  {
    title: "Sentence",
    en: "I want to learn about measurements.",
    ta: "நான் அளவீடு பற்றி அறிய விரும்புகிறேன்.",
    hi: "मैं मापन पद्धति सीखना चाहती हूँ।",
    en_audio: a2_en,
    ta_audio: a2_ta,
    hi_audio: a2_hi,
    image: p2,
  },
  {
    title: "Paragraph",
    en: "I want to learn about measurements. Let me begin with measuring the length.",
    ta: "நான் அளவீடு பற்றி அறிய விரும்புகிறேன். நீளம்‌ அளவிடிவதிலிருந்து ஆரம்பிக்கலாம்‌.",
    hi: "मैं मापन पद्धति सीखना चाहती हूँ। लंबाई मापने के तरिकों से मैं सीखना शुरू करूँगी।",
    en_audio: a3_en,
    ta_audio: a3_ta,
    hi_audio: a3_hi,
    image: p3,
  },
];

export default content_list;
