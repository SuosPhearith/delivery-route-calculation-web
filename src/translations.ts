// translations.ts
export enum Languages {
  EN = "en",
  KH = "kh",
}

export const TRANSLATIONS = {
  [Languages.EN]: {
    greeting: "Hello",
    description: "This is an example",
    case: "Case",
    dashboard: "Dashboard",
    route: "Route",
    truck: "Truck",
    warehouse: "Warehouse",
    office: "Office",
    driver: "Driver",
    direction: "Direction",
    system: "System",
  },
  [Languages.KH]: {
    greeting: "សួស្តី",
    description: "នេះគឺជាគំរូ",
    case: "កេស",
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    route: "ផ្លូវ",
    truck: "រថយន្ត",
    warehouse: "ឃ្លាំង",
    office: "ការិយាល័យ",
    driver: "អ្នកបើកបរ",
    direction: "ទិសដៅ",
    system: "ប្រព័ន្ធ",
  },
};
