import React from 'react';
import {AppProvider, Frame, Navigation, TopBar, Icon} from '@shopify/polaris';
import { withRouter } from 'react-router-dom';

import styles from './styles.css';


const theme = {
  colors: {
    topBar: {
      background: '#357997',
    },
  },
  logo: {
    width: 124,
    topBarSource:
      'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
    contextualSaveBarSource:
      'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
    url: 'https://github.com/fulfilio/Octantis',
    accessibilityLabel: 'Jaded Pixel',
  },
};

class FrameComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeName: 'Fulfil.io'
    };
  }

  toggleState(key) {
    return () => {
      this.setState((prevState) => ({[key]: !prevState[key]}));
    };
  };

  switchRoute(route) {
    if (this.props.location.pathname !== route) {
      this.props.history.push(route);
    }
  }

  render() {

    const { userMenuOpen, showMobileNavigation, storeName } = this.state;
    const { Component } = this.props;

    const userMenuActions = [
      {
        items: [{key: 1, content: 'All Releases'}],
      },
    ];

    const navigationUserMenuMarkup = (
      <Navigation.UserMenu
        actions={userMenuActions}
        name="Octantis"
        detail={storeName}
        avatarInitials="D"
      />
    );

    const userMenuMarkup = (
      <TopBar.UserMenu
        actions={userMenuActions}
        name="Fulfil User"
        detail={storeName}
        initials="FU"
        open={userMenuOpen}
        onToggle={this.toggleState('userMenuOpen')}
      />
    );


    const navigationMarkup = (
      <Navigation location="/" userMenu={navigationUserMenuMarkup}>
        {
          this.props.location.pathname !== '/home' ? <Navigation.Section
            items={[
              {
                label: 'Back to Home Page',
                icon: 'arrowLeft',
                onClick: () => this.switchRoute('/home')
              },
            ]}
          /> : null
        }
        <Navigation.Section
          separator
          title="Octantis Components"
          items={[
            {
              label: 'Table',
              icon: <i className={`${styles.navIcon} fas fa-table`}></i>,
              onClick: () => this.switchRoute('/table')
            },
          ]}
        />
      </Navigation>
    );

    const topBarMarkup = (
      <TopBar
        showNavigationToggle={true}
        userMenu={userMenuMarkup}
        onNavigationToggle={this.toggleState('showMobileNavigation')}
      />
    );

    return (
      <AppProvider theme={theme}>
        <Frame
          topBar={topBarMarkup}
          navigation={navigationMarkup}
          showMobileNavigation={showMobileNavigation}
          onNavigationDismiss={this.toggleState('showMobileNavigation')}
        >
          <div className={styles.container}>
            <Component />
          </div>
        </Frame>
      </AppProvider>
    );
  }
}

export default withRouter(FrameComponent);