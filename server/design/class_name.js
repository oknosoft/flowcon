module.exports = {
  class_name: {
    language: "query",
    views: {
      class_name: {
        map: {
          fields: {
            class_name: "asc"
          }
        },
        reduce: "_count",
        options: {
          def: {
            fields: [
              "class_name"
            ]
          }
        }
      }
    }
  }
};
