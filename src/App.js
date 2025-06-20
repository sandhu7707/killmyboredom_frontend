import './App.css';
import Home from './home/home';

function App() {
  console.log('App:rendered')

  return (
    <div id="app" className="App">
      <Home></Home>
    </div>
  );
}

export default App;
