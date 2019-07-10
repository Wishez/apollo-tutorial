import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import TokenStorage from '../utils/tokenStorage'
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg';

import styled, { css } from 'react-emotion';
import { colors, unit } from '../styles';

export const className = css({
    flexGrow: 1,
    width: 0,
    fontFamily: 'inherit',
    fontSize: 20,
    color: 'inherit',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    svg: {
      display: 'block',
      width: 60,
      margin: `0 auto ${unit}px`,
      fill: colors.secondary,
    },
  });

  const LogoutButtonStyled = styled('button')(className, {
    border: 0,
    background: 'none',
  });

function LogoutButton() {
    return (
        <ApolloConsumer>
            {client => (
                <LogoutButtonStyled onClick={() => {
                    TokenStorage.remove()
                    client.writeData({
                        data: {
                            isLoggedIn: false,
                        }
                    })
                }}>
                    <ExitIcon />

                    Exit
                </LogoutButtonStyled>
            )}
        </ApolloConsumer>
    )
}

  
export default LogoutButton