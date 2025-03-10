import React, { useState, useEffect } from 'react';
import { useRive, useStateMachineInput } from 'rive-react';
import { isElectron, getElectronAPI } from './utils/environment';

function App() {
  // Load the Rive animation
  const STATE_MACHINE_NAME = "State Machine 1"; // 👈 Your state machine's name from Rive
  const HOVER_INPUT = "Hover"; // 👈 Input name from your state machine
  const SWITCH_THEME_INPUT = "swithTheme"; // 👈 Make sure this matches your exact Rive input name

  // State to track input values for debugging
  const [debugInfo, setDebugInfo] = useState({
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

  // Update debug info when theme input value changes
  useEffect(() => {
    if (switchThemeInput) {
      setDebugInfo({
        themeState: switchThemeInput?.value || false
      });
    }
  }, [switchThemeInput?.value]);

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
      setDebugInfo({
        themeState: switchThemeInput.value
      });
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

  // Keep the environment detection but comment out the UI elements
  const [electronFeatures, setElectronFeatures] = useState(false);

  useEffect(() => {
    // Check if we're running in Electron
    if (isElectron()) {
      setElectronFeatures(true);
    }
    
    if (rive && hoverInput) {
      const updateHoverState = (isHovering) => {
        if (hoverInput) {
          hoverInput.value = isHovering;
        }
      };

      // Listen for hover events
      rive.on('knob hover', () => {
        updateHoverState(true);
      });
      rive.on('knob unhover', () => {
        updateHoverState(false);
      });
      // Listen for tap/click events for mobile
      rive.on('knob tap', () => updateHoverState(true));
      // Reset hover state after a short delay when tapped
      rive.on('knob release', () => {
        setTimeout(() => updateHoverState(false), 300);
      });

      // Cleanup listeners on unmount
      return () => {
        rive.off('knob hover');
        rive.off('knob unhover');
        rive.off('knob tap');
        rive.off('knob release');
      };
    }
  }, [rive, hoverInput]);

  /* Keeping the handler but commenting out for future use
  const handleFileAction = async () => {
    if (isElectron()) {
      // Use Electron API for file operations
      const api = getElectronAPI();
      if (api) {
        const result = await api.openFile();
        // Handle result
      }
    } else {
      // Web fallback - perhaps use the File System Access API
      // or show a different UI option for web users
      alert('This feature uses the file system and is only available in the desktop app');
    }
  };
  */

  return (
    <div className="app" style={appStyles}>
      <h1>Vite + Electron + Rive</h1>
      <div
        className="rive-container"
        style={{ 
          width: 400, 
          height: 300, 
          backgroundColor: debugInfo.themeState ? '#e0e0e0' : '#444',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease',
          margin: '0 auto'
        }}
        onClick={handleToggle}
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
          <li><strong>Theme Switch:</strong> {debugInfo.themeState ? 'ON (Light)' : 'OFF (Dark)'}</li>
        </ul>
      </div>
      
      {/* Commenting out the file button while keeping environment support
      <button onClick={handleFileAction}>
        {electronFeatures ? 'Open File (Desktop)' : 'Files (Web Preview)'}
      </button>
      */}
    </div>
  );
}

export default App;