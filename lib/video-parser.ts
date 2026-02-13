// Auto-detect map names and content tags from video titles/descriptions

const BF1942_MAPS: Record<string, string[]> = {
  "Wake Island": ["wake island", "wake_island"],
  "El Alamein": ["el alamein", "el_alamein", "elalamein"],
  "Stalingrad": ["stalingrad"],
  "Midway": ["midway", "battle of midway"],
  "Berlin": ["berlin"],
  "Market Garden": ["market garden", "marketgarden"],
  "Omaha Beach": ["omaha beach", "omaha"],
  "Iwo Jima": ["iwo jima", "iwojima"],
  "Guadalcanal": ["guadalcanal"],
  "Tobruk": ["tobruk"],
  "Bocage": ["bocage"],
  "Gazala": ["gazala"],
  "Kursk": ["kursk"],
  "Battle of the Bulge": ["battle of the bulge", "bulge"],
  "Coral Sea": ["coral sea"],
  "Operation Aberdeen": ["operation aberdeen", "aberdeen"],
  "Kharkov": ["kharkov"],
  "Bastogne": ["bastogne"],
  "Operation Battleaxe": ["operation battleaxe", "battleaxe"],
  "Manila Bay": ["manila"],
  // Desert Combat maps
  "DC Al Nas": ["al nas", "dc al nas"],
  "DC Basrah": ["basrah", "dc basrah"],
  "DC Lost Village": ["lost village"],
  "DC Desert Shield": ["desert shield", "desertshield"],
  "DC Gazala": ["dc gazala"],
  // Forgotten Hope maps
  "Foy": ["foy"],
  "Seelow Heights": ["seelow"],
  "Operation Luttich": ["luttich"],
}

const CONTENT_TAGS: Record<string, string[]> = {
  montage: ["montage", "compilation", "highlights", "best of", "best moments"],
  tutorial: ["tutorial", "guide", "how to", "tips", "tricks", "beginner"],
  funny: ["funny", "wtf", "fails", "lol", "hilarious", "moments"],
  clutch: ["clutch", "insane", "incredible", "epic", "amazing"],
  sniper: ["sniper", "sniping", "headshot", "long range"],
  tank: ["tank", "panzer", "sherman", "tiger", "armor"],
  planes: ["plane", "planes", "dogfight", "flying", "pilot", "air combat", "aviation"],
  infantry: ["infantry", "rifle", "assault"],
  naval: ["naval", "ship", "submarine", "destroyer", "carrier"],
  livestream: ["livestream", "live stream", "stream"],
  nostalgia: ["nostalgia", "nostalgic", "classic", "throwback", "retro"],
}

const MOD_TAGS: Record<string, string[]> = {
  "Desert Combat": ["desert combat", "desertcombat", "dc mod"],
  "Forgotten Hope": ["forgotten hope", "forgottenhope", "fh mod"],
  "Battlegroup42": ["battlegroup42", "battlegroup 42", "bg42"],
  "Eve of Destruction": ["eve of destruction", "eod"],
  "Galactic Conquest": ["galactic conquest", "star wars bf1942"],
  "Interstate 82": ["interstate 82", "interstate82"],
}

export interface VideoTags {
  detected_map: string | null
  detected_tags: string[]
}

export function parseVideoTags(title: string, description?: string): VideoTags {
  const text = `${title} ${description || ""}`.toLowerCase()

  // Detect map
  let detected_map: string | null = null
  for (const [mapName, patterns] of Object.entries(BF1942_MAPS)) {
    if (patterns.some(p => text.includes(p))) {
      detected_map = mapName
      break
    }
  }

  // Detect content tags
  const detected_tags: string[] = []

  for (const [tag, patterns] of Object.entries(CONTENT_TAGS)) {
    if (patterns.some(p => text.includes(p))) {
      detected_tags.push(tag)
    }
  }

  // Detect mod tags
  for (const [mod, patterns] of Object.entries(MOD_TAGS)) {
    if (patterns.some(p => text.includes(p))) {
      detected_tags.push(mod)
    }
  }

  return { detected_map, detected_tags }
}
