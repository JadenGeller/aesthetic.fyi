import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';

export interface RelatedStyle {
  slug: string;
  relationship: string;
}

export interface Characteristic {
  title: string;
  description: string;
}

export interface Aesthetic {
  slug: string;
  name: string;
  coined: boolean;
  tagline: string;
  prompt: string;
  about: string;
  characteristics: Characteristic[];
  good_for: string[];
  not_for: string[];
  history: string;
  related: RelatedStyle[];
}

const DATA_DIR = path.join(process.cwd(), 'src/data/aesthetics');

export function loadAesthetic(slug: string): Aesthetic {
  const filePath = path.join(DATA_DIR, `${slug}.yaml`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(content) as Aesthetic;
}

export function loadAllAesthetics(): Aesthetic[] {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.yaml'));
  return files.map(f => {
    const content = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
    return yaml.load(content) as Aesthetic;
  });
}
