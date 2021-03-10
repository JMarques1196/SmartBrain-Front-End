
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({ // API key should be on back-end for security reasons.
 apiKey: '0421bc974ff74516b26dcfbf3b91f650'
});




const particlesOptions = {

	particles: {
		number: {
			value: 100,
			density: {
				enable : true,
				value_area: 800

			}
		}
	}
}

const initialState = {
			input: '',
			imageUrl: '', // '' means we created a ImageUrl state but its empty for now
			box: {},
			route: 'signin', // Keeps track of where we are on the page
			isSignedIn: false,
			user:{		
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: ''
			}	
}

class App extends Component{ // We need state, to remeber an user and update it

	constructor(){
		super();
		this.state = initialState; // the this keyword represents the component that owns the method, in this case App (w3schools react events)

		}
	

	loadUser = (data) => {
		this.setState({user:{
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined

		}})
	}

	calcFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
			return {
				leftCol: clarifaiFace.left_col * width, // left_col is a % of the witdh, thats why we multiply them
				topRow: clarifaiFace.top_row * height,
				rightCol : width - (clarifaiFace.right_col * width),
				bottomRow: height - (clarifaiFace.bottom_row * height),
			}

	}


	displayFaceBox = (box) => {
		console.log(box);
		this.setState({box: box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value}); // taget.value gives the value of the event
	}

	onButtonSubmit = () => {

	this.setState({imageUrl: this.state.input});

 	app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
 	.then(response => {
 		if (response){
 			fetch('https://immense-woodland-01833.herokuapp.com/image',{
 				method: 'put',
				headers: {'Content-Type':'application/json'},
				body: JSON.stringify({
				id: this.state.user.id
 			})
 		})
 			.then(response => response.json())
 			.then(count => {
 				this.setState(Object.assign(this.state.user, {entries: count}))
 			})
 		}
 		this.displayFaceBox(this.calcFaceLocation(response))
 	})
 		.catch(err => console.log(err));
	}

	onRouteChange = (route) => {
		if(route==='signout'){
			this.setState(initialState)
		}else if (route==='home'){
			this.setState({isSignedIn: true})
		}
		this.setState({route: route});
	}

	render(){ // a Component must contain a render function
	// We could destructure a lot using const {isSignedin, imageUrl, route, box} = this.state;
		return(
			<div className="App">	

			<Particles className = 'particles'
              params={particlesOptions}
            		
			/>	


				<Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} /> {//These will render in the order they appear 
								}
				{this.state.route === 'home'	// curly brackets turn this into a js expression		
					//We need to wrap JSX elements in a div
					?<div> 
						<Logo />
						<Rank name={this.state.user.name} entries={this.state.user.entries}/> 
						<ImageLinkForm 
						onInputChange={this.onInputChange} 
						onButtonSubmit={this.onButtonSubmit}
						/> {//Pass onInputChange and onButtonSubmit as a prop
							}
						<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
					</div>
						:(
							this.state.route==='signin'
							?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
							:<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

						)
						
				}
			</div>
              
		);

	}

}







export default App;
