import DB from '../../../../public/data.json';
import { CONF } from '../../../lib/wc.js';
import { og } from '../../../og/render.js';

export function getStaticPaths() {
  return DB.teams.map((t: any) => ({ params: { code: t.fifa_code.toLowerCase() }, props: { t } }));
}

export async function GET({ props }: any) {
  const t = props.t;
  const col = CONF[t.confederation] || '#e9bb4c';
  const markup = `
  <div style="display:flex;flex-direction:column;width:1200px;height:630px;background:#0a0a0d;color:#f5f1e9;font-family:Archivo;padding:70px">
    <div style="display:flex;position:absolute;top:0;left:0;width:1200px;height:8px">
      <div style="display:flex;width:400px;height:8px;background:#e4572e"></div>
      <div style="display:flex;width:400px;height:8px;background:#36d27a"></div>
      <div style="display:flex;width:400px;height:8px;background:#5b9cff"></div>
    </div>
    <div style="display:flex;font-size:24px;color:#e9bb4c;letter-spacing:3px">FIFA WORLD CUP 2026</div>
    <div style="display:flex;flex-grow:1"></div>
    <div style="display:flex;font-size:24px;color:#a59e90">Group ${t.group_letter}  ·  ${t.confederation}</div>
    <div style="display:flex;font-family:Anton;font-size:128px;color:#f5f1e9">${t.team_name}</div>
    <div style="display:flex;margin-top:16px;font-size:26px;color:#a59e90">${t.head_coach || ''}${t.fifa_ranking ? '   ·   FIFA #' + t.fifa_ranking : ''}   ·   ${t.squad_size} players</div>
    <div style="display:flex;position:absolute;right:70px;bottom:64px;font-family:Anton;font-size:44px;color:${col}">${t.fifa_code}</div>
  </div>`;
  const png = await og(markup);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
