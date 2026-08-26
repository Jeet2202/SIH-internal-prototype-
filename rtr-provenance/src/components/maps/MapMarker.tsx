/**
 * PRAMANA — Standard Leaflet Map Markers
 *
 * Custom SVG HTML icon generator matching botanical dark glass design.
 */

import L from 'leaflet'
import { STAGE_MAP_COLORS, type StageMapType } from './mapConfig'

export interface CreateMarkerOptions {
  type?:        StageMapType
  color?:       string
  label?:       string
  sublabel?:    string
  icon?:        'leaf' | 'flask' | 'truck' | 'factory' | 'package' | 'pin'
  pulse?:       boolean
}

export function createStageMarkerIcon({
  type = 'farmer',
  color,
  label,
  sublabel,
  icon = 'pin',
  pulse = true,
}: CreateMarkerOptions): L.DivIcon {
  const accentColor = color || STAGE_MAP_COLORS[type] || '#7ec85a'

  const iconSvgs: Record<string, string> = {
    leaf: `<path d="M12 2C8 2 5 4 4 7c1 0 2 .5 3 1.5C8 7 9.5 6 11 6c1.5 0 3 1 4 2.5C16 7.5 17 7 18 7c-1-3-4-5-6-5z" stroke="${accentColor}" stroke-width="1.6" fill="${accentColor}30"/>
           <path d="M4 7c-1.5 2-2 4.5-1 7l8 5 8-5c1-2.5.5-5-1-7" stroke="${accentColor}" stroke-width="1.6"/>`,
    flask: `<path d="M9 3h6M10 3v6l-4 8a1 1 0 001 1h10a1 1 0 001-1l-4-8V3" stroke="${accentColor}" stroke-width="1.6" fill="${accentColor}25" stroke-linecap="round"/>
            <circle cx="12" cy="14" r="1.5" fill="${accentColor}"/>`,
    truck: `<rect x="2" y="8" width="13" height="8" rx="1.5" stroke="${accentColor}" stroke-width="1.6" fill="${accentColor}25"/>
            <path d="M15 10h3.5l3 4V16h-6.5V10z" stroke="${accentColor}" stroke-width="1.6" fill="${accentColor}25"/>
            <circle cx="6" cy="17" r="1.8" fill="${accentColor}"/>
            <circle cx="18" cy="17" r="1.8" fill="${accentColor}"/>`,
    factory: `<rect x="3" y="11" width="18" height="9" rx="1" stroke="${accentColor}" stroke-width="1.6" fill="${accentColor}25"/>
              <path d="M7 11V7l5 4V7l5 4V7l3 3" stroke="${accentColor}" stroke-width="1.6" stroke-linecap="round"/>`,
    package: `<rect x="7" y="3" width="10" height="18" rx="2.5" stroke="${accentColor}" stroke-width="1.6" fill="${accentColor}25"/>
              <path d="M7 7.5h10" stroke="${accentColor}" stroke-width="1.6"/>`,
    pin: `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="${accentColor}" stroke-width="1.6" fill="${accentColor}30"/>
          <circle cx="12" cy="9" r="2.5" fill="${accentColor}"/>`,
  }

  const svgContent = iconSvgs[icon] || iconSvgs.pin

  const html = `
    <div style="position:relative; display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%);">
      ${pulse ? `<div style="position:absolute; top:12px; left:50%; transform:translate(-50%, -50%); width:32px; height:32px; border-radius:50%; border:1.5px solid ${accentColor}60; animation:rtr-pulse 2s ease-out infinite;"></div>` : ''}
      <div style="
        width:30px; height:30px; border-radius:50%;
        background:rgba(8,12,8,0.92);
        border:1.5px solid ${accentColor};
        box-shadow:0 0 14px ${accentColor}70, 0 4px 12px rgba(0,0,0,0.8);
        display:flex; align-items:center; justify-content:center;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          ${svgContent}
        </svg>
      </div>
      ${label ? `
        <div style="
          margin-top:4px;
          background:rgba(6,10,6,0.92);
          border:1px solid ${accentColor}45;
          border-radius:5px;
          padding:2px 7px;
          white-space:nowrap;
          font-family:'IBM Plex Mono', monospace;
          font-size:7.5px;
          font-weight:600;
          letter-spacing:0.10em;
          text-transform:uppercase;
          color:${accentColor};
          box-shadow:0 2px 8px rgba(0,0,0,0.6);
        ">
          ${label}
          ${sublabel ? `<span style="color:rgba(200,220,190,0.6); margin-left:4px;">${sublabel}</span>` : ''}
        </div>
      ` : ''}
    </div>
  `

  return L.divIcon({
    html,
    className: 'rtr-leaflet-marker',
    iconSize:  [32, 32],
    iconAnchor:[16, 32],
    popupAnchor:[0, -32],
  })
}
