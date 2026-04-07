import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Module-level cache: geladen bij eerste aanroep, daarna in geheugen
let _soltoData: any[] | null = null;
let _regioData: any[] | null = null;
// Index voor O(1) opzoeken
let _soltoIndex: Map<number, any> | null = null;
let _regioIndex: Map<number, any> | null = null;

function getSoltoIndex(): Map<number, any> {
  if (!_soltoIndex) {
    const filePath = path.join(process.cwd(), 'src/lib/solto-detail-data.json');
    _soltoData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    _soltoIndex = new Map(_soltoData!.map((p: any) => [p.id, p]));
  }
  return _soltoIndex!;
}

function getRegioIndex(): Map<number, any> {
  if (!_regioIndex) {
    const filePath = path.join(process.cwd(), 'src/lib/regio-detail-data.json');
    _regioData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    _regioIndex = new Map(_regioData!.map((p: any) => [p.id, p]));
  }
  return _regioIndex!;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  if (isNaN(numId)) {
    return NextResponse.json({ error: 'Ongeldig ID' }, { status: 400 });
  }

  // Probeer SOLTO eerst (kleine dataset, snel)
  const soltoPlayer = getSoltoIndex().get(numId);
  if (soltoPlayer) {
    return NextResponse.json({ ...soltoPlayer, source: 'solto' });
  }

  // Dan regio (grote dataset, maar gecached na eerste aanroep)
  const regioPlayer = getRegioIndex().get(numId);
  if (regioPlayer) {
    return NextResponse.json({ ...regioPlayer, source: 'regio' });
  }

  return NextResponse.json({ error: 'Speler niet gevonden' }, { status: 404 });
}
