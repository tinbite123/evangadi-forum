import React from 'react'
import styled from 'styled-components'
import loadingGif from '../assets/preloader.gif'

function Loading() {
  return (
    <Wrapper>
        <img src={loadingGif} />
    </Wrapper>
  )
}

const Wrapper = styled.section`
    display: flex;
    justify-content: center:
    algin-items: center;
    height: 100vh;
    background-color: #fff;
    img {
        width: 50px
        opacity: 0.8;
}
`;
export default Loading