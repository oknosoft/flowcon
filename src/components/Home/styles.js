export default function (theme) {
  return {
    root: {
      flex: '1 0 100%',
    },
    hero: {
      minHeight: '100vh', // Makes the hero full height until we get some more content.
      flex: '0 0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.primary[500] : theme.palette.primary[800],
      color: theme.palette.getContrastText(theme.palette.primary[500]),
    },
    content: {
      paddingTop: theme.spacing.unit * 4,
      paddingBottom: theme.spacing.unit * 4,
      [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing.unit * 6,
        paddingBottom: theme.spacing.unit * 6,
      },
    },
    text: {
      paddingLeft: theme.spacing.unit * 6,
      paddingRight: theme.spacing.unit * 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    headline: {
      maxWidth: 500,
      textAlign: 'center',
    },
    button: {
      marginTop: theme.spacing.unit * 3,
    },
    logo: {
      margin: '20px 0',
      width: '100%',
      height: '20vw',
      maxHeight: 120,
    },
  };
}
