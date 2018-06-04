export default function (theme) {
  return {
    root: {
      flex: '1 0 100%',
    },
    hero: {
      minHeight: '95vh', // Makes the hero full height until we get some more content.
      backgroundColor: theme.palette.grey[100],
    },
    content: {
      paddingTop: '5vh',
      maxWidth: '75vw',
    },
    menu: {
      paddingTop: '5vh',
      cursor: 'pointer',
    },
    news: {
      paddingLeft: theme.spacing.unit * 2,
    },
    button: {
      marginTop: theme.spacing.unit * 3,
    },
    logo: {
      width: '20vw',
      height: '20vw',
      maxWidth: 100,
      maxHeight: 100,
    },
  };
}
