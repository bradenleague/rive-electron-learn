import React, { useState, useEffect } from 'react';
import { useRive, useStateMachineInput } from 'rive-react';

function App() {
  // Load the Rive animation
  const STATE_MACHINE_NAME = "State Machine 1"; // 👈 Your state machine's name from Rive
  const HOVER_INPUT = "Hover"; // 👈 Input name from your state machine
  const SWITCH_THEME_INPUT = "swithTheme"; // 👈 Make sure this matches your exact Rive input name

  // State to track input values for debugging
  const [debugInfo, setDebugInfo] = useState({
    hoverState: false,
    themeState: false
  });

  const { RiveComponent, rive } = useRive({
    src: '/animations/example.riv', // 👈 Replace with your actual .riv file path
    stateMachines: STATE_MACHINE_NAME, // 👈 Attach the state machine
    autoplay: true, // 👈 Starts the animation automatically
  });

  // Hook into the 'Hover' input
  const hoverInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    HOVER_INPUT
  );

  // Hook into the 'swithTheme' input
  const switchThemeInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    SWITCH_THEME_INPUT
  );

  // Update debug info when input values change
  useEffect(() => {
    if (hoverInput || switchThemeInput) {
      setDebugInfo({
        hoverState: hoverInput?.value || false,
        themeState: switchThemeInput?.value || false
      });
    }
  }, [hoverInput?.value, switchThemeInput?.value]);

  // Example: Toggle 'swithTheme' when clicking the container
  const handleToggle = () => {
    if (switchThemeInput) {
      // Try both approaches - toggle value or fire trigger
      if (typeof switchThemeInput.fire === 'function') {
        // If it's a trigger input, fire it
        switchThemeInput.fire();
      } else {
        // If it's a boolean input, toggle it
        switchThemeInput.value = !switchThemeInput.value;
      }
      
      // Update debug info
      setDebugInfo(prev => ({
        ...prev,
        themeState: switchThemeInput.value
      }));
    }
  };

  // Example: Trigger hover on mouse events
  const handleMouseEnter = () => {
    if (hoverInput) {
      hoverInput.value = true;
      setDebugInfo(prev => ({ ...prev, hoverState: true }));
    }
  };

  const handleMouseLeave = () => {
    if (hoverInput) {
      hoverInput.value = false;
      setDebugInfo(prev => ({ ...prev, hoverState: false }));
    }
  };

  // Define the theme-based styles
  const appStyles = {
    backgroundColor: debugInfo.themeState ? '#f5f5f5' : '#333',
    color: debugInfo.themeState ? '#333' : '#fff',
    minHeight: '100vh',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    padding: '20px'
  };

  return (
    <div className="app" style={appStyles}>
      <h1>Vite + Electron + Rive</h1>
      <div
        className="rive-container"
        style={{ 
          width: 400, 
          height: 400, 
          backgroundColor: debugInfo.themeState ? '#e0e0e0' : '#444',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease',
          margin: '0 auto'
        }}
        onClick={handleToggle} // 👈 Click to toggle the switch
        onMouseEnter={handleMouseEnter} // 👈 Start hover effect
        onMouseLeave={handleMouseLeave} // 👈 Stop hover effect
      >
        <RiveComponent />
      </div>
      <div className="state-machine-debug" style={{ 
        marginTop: '20px',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: debugInfo.themeState ? '#e0e0e0' : '#444',
        transition: 'background-color 0.3s ease'
      }}>
        <h3>State Machine Debug Info</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><strong>State Machine:</strong> {STATE_MACHINE_NAME}</li>
          <li><strong>Hover State:</strong> {debugInfo.hoverState ? 'Active' : 'Inactive'}</li>
          <li><strong>Theme Switch:</strong> {debugInfo.themeState ? 'ON (Light)' : 'OFF (Dark)'}</li>
          <li><strong>Input Types:</strong> 
            Hover: {hoverInput ? (typeof hoverInput.fire === 'function' ? 'Trigger' : 'Boolean') : 'Not loaded'}, 
            Switch: {switchThemeInput ? (typeof switchThemeInput.fire === 'function' ? 'Trigger' : 'Boolean') : 'Not loaded'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;