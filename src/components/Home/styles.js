export default function (theme) {
  return {
    root: {
      flex: '1 0 100%',
    },
    hero: {
      paddingTop: '10vh',
      minHeight: '95vh', // Makes the hero full height until we get some more content.
      backgroundColor: theme.palette.grey[100],
    },
    content: {
      maxWidth: '75vw',
      cursor: 'pointer',
    },
    button: {
      marginTop: theme.spacing.unit * 3,
    },
    logo: {
      cursor: 'pointer',
      width: '20vw',
      height: '20vw',
      maxWidth: 100,
      maxHeight: 100,
    },
  };
}
