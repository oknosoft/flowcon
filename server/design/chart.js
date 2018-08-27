/**
 * демо-диаграмма
 */

module.exports = {
  "_no_design": true,
  "default": {
    charts: [
      "doc/chart|first"
    ]
  },
  "chart|first": {
    title: "Первая диаграмма",
    description: "Описание первой диаграммы",
    rows: [
      {
        name: "Page A",
        uv: {value: 4000, color: "#ff7f0e"},
        pv: {value: 2400, color: "#7f7f7f"}
      },
      {
        name: "Page B",
        uv: {value: 3000, color: "#ff7f0e"},
        pv: {value: 2700, color: "#2ca02c"}
      }
      ],
    series: [
      {name: pv, color: "#7f7f7f"},
      {name: uv, color: "#ff7f0e"}
      ],
    kind: "bar"
  }
};
