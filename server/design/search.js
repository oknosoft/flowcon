module.exports = {
  mango: {
    language: "query",
    views: {
      search: {
        map: {
          fields: {
            class_name: "asc",
            date: "asc",
            search: "asc"
          }
        },
        reduce: "_count",
        options: {
          def: {
            fields: [
              "class_name",
              "date",
              "search"
            ]
          }
        }
      }
    }
  }
};

