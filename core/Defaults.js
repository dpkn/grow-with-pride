import { Light, Dark, Realistic, Rainbow } from './ColorPresets';

export default {
  /**
    Simulation configurations
  */

  VenationType: 'Closed',         // venation can be "Open" or "Closed"
  SegmentLength: 1,             // length of each branch segment. Smaller numbers mean smoother lines, but more computation cost
  AttractionDistance: 30,       // radius of influence (d_i) around each attractor that attracts nodes
  KillDistance: 6,              // distance (d_k) between attractors and nodes when branches are ended
  IsPaused: true,              // initial pause/unpause state
  EnableCanalization: true,     // turns on/off auxin flux canalization (line segment thickening)
  EnableOpacityBlending: true,  // turns on/off opacity
  MaxThickness:3,


  /**
    Rendering configurations
  */

  // Visibility toggles
  ShowAttractors: false,       // toggled with 'a'
  ShowNodes: true,             // toggled with 'n'
  ShowTips:true,             // toggled with 't'
  ShowAttractionZones:false,  // toggled with 'z'
  ShowKillZones: false,        // toggled with 'k'
  ShowInfluenceLines:false,   // toggled with 'i'
  ShowBounds:true,           // toggled with 'b'
  ShowObstacles: true,        // toggled with 'o'

  // Modes
  RenderMode: 'Dots',  // draw branch segments as "Lines" or "Dots"

  // Colors
  Colors: Rainbow,

  // Line thicknesses
  BranchThickness: 1,
  TipThickness: 1,
  BoundsBorderThickness: 3
}