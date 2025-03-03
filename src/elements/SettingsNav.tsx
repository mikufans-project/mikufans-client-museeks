import cx from 'classnames';
import type React from 'react';
import { NavLink } from 'react-router';

import styles from './SettingsNav.module.css';

interface WrapProps {
  children: React.ReactNode;
  vertical?: boolean;
}

/**
 * Wrapper for navigation
 */
export function Wrap(props: WrapProps) {
  return (
    <nav className={cx(styles.nav, { [styles.navVertical]: props.vertical })}>
      {props.children}
    </nav>
  );
}

interface LinkProps {
  children: React.ReactNode;
  to: string;
}

/**
 * Single navigation item (anchor)
 */
export function Link(props: LinkProps) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        `${styles.navLink} ${isActive && styles.navLinkActive}`
      }
      draggable={false}
    >
      {props.children}
    </NavLink>
  );
}
