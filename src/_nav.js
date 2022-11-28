const admin = [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-home',
  },
  {
    component: 'CNavItem',
    name: 'AlertList',
    to: '/alert_list',
    icon: 'cil-bell-exclamation',
  },
  {
    component: 'CNavItem',
    name: 'NotifyManagement',
    to: '/notify_management',
    icon: 'cil-settings',
  },
  {
    component: 'CNavItem',
    name: 'ChannelManagement',
    to: '/channel_management',
    icon: 'cil-settings',
  },
  {
    component: 'CNavItem',
    name: 'CameraManagement',
    to: '/camera_management',
    icon: 'cil-settings',
  },
  {
    component: 'CNavItem',
    name: 'AccountMangement',
    to: '/account_management',
    icon: 'cil-group',
  },
];

const user = [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-chart-pie',
  },
  {
    component: 'CNavItem',
    name: 'AlertList',
    to: '/alert_list',
    icon: 'cil-bell-exclamation',
  },
];

const guest = [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-chart-pie',
  },
];

// {
//   component: 'CNavGroup',
//   name: 'Example',
//   to: '/example',
//   icon: 'cil-puzzle',
//   items: [
//     {
//       component: 'CNavItem',
//       name: 'Example1',
//       to: '/example/1',
//     },
//     {
//       component: 'CNavItem',
//       name: 'Example2',
//       to: '/example/2',
//     },
//     {
//       component: 'CNavItem',
//       name: 'Example3',
//       to: '/example/3',
//     },
//   ],
// },

export { admin, user, guest };