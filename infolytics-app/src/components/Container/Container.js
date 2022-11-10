import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const Container = ({ children }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3, delay: 500 });
    //let animatedClass = extClass + ' animate__animated animate__zoomIn';

    return (
        <ContainerContent
            ref={ref}
        >
            {children}
        </ContainerContent>
    )
}

const ContainerContent = styled.div`
    width: 75rem;
    align-self: center;
    text-align: center;
    margin: auto;
    margin-bottom: 4rem;
    margin-top: 4rem;
    padding: 2rem;

    background-color: #f9f9f9;
    border: 1px solid rgba(var(--b6a,219,219,219),1);
    border-radius: 15px;
`

export default Container;