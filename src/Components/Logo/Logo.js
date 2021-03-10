import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './Logo.png'


const Logo = () => { // Since this component has no state , we can use a pure function

	return(
		
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 25 }} style={{ height: 100, width: 100 }} >
 				<div className="Tilt-inner pa3">
 					<img style={{paddingTop: '2px'}} alt='Logo' src={brain}/>
 				</div>
			</Tilt>

		</div>
	);

}

export default Logo;