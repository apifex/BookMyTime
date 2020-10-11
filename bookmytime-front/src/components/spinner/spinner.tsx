
import React from 'react';
import './spinner.scss';

interface LoadingProps {
    isLoading: boolean
}

const WithSpinner = <P extends object>(
    Component: React.ComponentType<P>): React.FC<P & LoadingProps> => ({
        isLoading, ...props
    }: LoadingProps)=> {
    
    return isLoading?(
        <div className='spinnerContainer'>
            <div className='spinner'></div>
        </div>
    ):(
        <Component {...props as P} />
    )  
    
}

export default WithSpinner