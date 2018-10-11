/**
 * Кнопки социальных сетей
 * @module Social
 *
 * Created by Evgeniy Malyarov on 19.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

// https://github.com/nygardk/react-share/blob/master/demo/Demo.jsx
import {
  // FacebookShareCount,
  // GooglePlusShareCount,
  // VKShareCount,
  // OKShareCount,

  FacebookShareButton,
  TwitterShareButton,
  GooglePlusShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  //WhatsappShareButton,
  MailruShareButton,
  EmailShareButton,

  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  //WhatsappIcon,
  MailruIcon,
  EmailIcon,
} from 'react-share';

const styles = theme => ({
  share: {
    cursor: 'pointer',
    '&:hover:not(:active)': {
      opacity: 0.75
    },
    display: 'inline-block',
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  root: {
    marginTop: theme.spacing.unit * 2,
  }
});

function Social(props) {

  const {title, classes} = props;
  const {href} = location;

  /*
  <WhatsappShareButton
    url={href}
    title={title}
    separator=":: "
    className={classes.share}>
    <WhatsappIcon size={32} round />
  </WhatsappShareButton>
  */

  return (
    <div key="share" className={classes.root}>
      <Typography variant="h6" component="h3" color="primary">Поделиться ссылкой:</Typography>
      <FacebookShareButton
        url={href}
        quote={title}
        className={classes.share}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={href}
        title={title}
        className={classes.share}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <TelegramShareButton
        url={href}
        title={title}
        className={classes.share}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>
      <GooglePlusShareButton
        url={href}
        className={classes.share}>
        <GooglePlusIcon size={32} round />
      </GooglePlusShareButton>
      <VKShareButton
        url={href}
        windowWidth={660}
        windowHeight={460}
        className={classes.share}>
        <VKIcon size={32} round />
      </VKShareButton>
      <OKShareButton
        url={href}
        windowWidth={660}
        windowHeight={460}
        className={classes.share}>
        <OKIcon size={32} round />
      </OKShareButton>
      <MailruShareButton
        url={href}
        title={title}
        className={classes.share}>
        <MailruIcon size={32} round />
      </MailruShareButton>
      <EmailShareButton
        url={href}
        subject={title}
        body={href}
        className={classes.share}>
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
}

Social.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(Social);
