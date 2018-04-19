/**
 * Кнопки социальных сетей
 * @module Social
 *
 * Created by Evgeniy Malyarov on 19.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

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
  //OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
 // MailruShareButton,

  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  VKIcon,
  //OKIcon,
  TelegramIcon,
  WhatsappIcon,
  //MailruIcon,
  EmailIcon,
} from 'react-share';

const styles = {
  share: {
    cursor: 'pointer',
    '&:hover:not(:active)': {
      opacity: 0.75
    },
    display: 'inline-block',
    marginRight: 16
  }
};

function Social(props) {

  const {title, classes} = props;
  const {href} = location;

  return (
    <div key="share">
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
      <WhatsappShareButton
        url={href}
        title={title}
        separator=":: "
        className={classes.share}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
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
