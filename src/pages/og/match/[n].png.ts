import DB from '../../../../public/data.json';
import { indexes } from '@shared/lib/wc.js';
import { og } from '@shared/lib/og/render.js';

const IDX = indexes(DB);

export function getStaticPaths() {
  return DB.matches.map((m: any) => ({ params: { n: String(m.match_number) }, props: { m } }));
}

export async function GET({ props }: any) {
  const m = props.m;
  const ht = m.home_code ? IDX.teamByCode[m.home_code] : null;
  const at = m.away_code ? IDX.teamByCode[m.away_code] : null;
  const parts = (m.match_label || '').split(/\s+vs\s+/);
  const home = ht ? ht.team_name : (parts[0] || 'TBD');
  const away = at ? at.team_name : (parts[1] || 'TBD');
  const markup = `
  <div style="display:flex;flex-direction:column;width:1200px;height:630px;background:#0a0a0d;color:#f5f1e9;font-family:Archivo;padding:70px;align-items:center;justify-content:center">
    <div style="display:flex;position:absolute;top:0;left:0;width:1200px;height:8px">
      <div style="display:flex;width:600px;height:8px;background:#e9bb4c"></div>
      <div style="display:flex;width:600px;height:8px;background:#5b9cff"></div>
    </div>
    <div style="display:flex;font-size:24px;color:#e9bb4c;letter-spacing:3px">${m.stage} · MATCH ${m.match_number}</div>
    <div style="display:flex;align-items:center;justify-content:center;margin-top:24px">
      <div style="display:flex;font-family:Anton;font-size:84px;color:#f5f1e9;max-width:430px">${home}</div>
      <div style="display:flex;font-family:Anton;font-size:54px;color:#e9bb4c;margin:0 34px">VS</div>
      <div style="display:flex;font-family:Anton;font-size:84px;color:#f5f1e9;max-width:430px">${away}</div>
    </div>
    <div style="display:flex;margin-top:30px;font-size:26px;color:#a59e90">${(m.kickoff_at || '').slice(0, 10)}  ·  ${m.venue || ''}, ${m.city || ''}</div>
  </div>`;
  const png = await og(markup);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
