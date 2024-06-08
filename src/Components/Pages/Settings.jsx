import React, { useContext } from 'react';
import { SettingsContext } from '../Pages/SettingsContext';
import '../Design/settings.css';

function Settings() {
  const { settings, setSettings } = useContext(SettingsContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  return (
    <div className='settings'>
      <table className='settings-table'>
        <tbody>
          <tr>
            <td>Default Model</td>
            <td>
              <select
                name="model"
                value={settings.model}
                onChange={handleChange}
                style={{ width: '400px' }}
              >
                <option value="gpt-4-turbo">gpt-4-turbo</option>
                <option value="gpt-4-turbo 2024-04-09">gpt-4-turbo 2024-04-09</option>
                <option value="gpt-4-0125-preview">gpt-4-0125-preview</option>
                <option value="gpt-4-1106-preview">gpt-4-1106-preview</option>
                <option value="gpt-4-0613">gpt-4-0613</option>
                <option value="gpt-4-32k-0613">gpt-4-32k-0613</option>
                <option value="gpt-3.5-turbo-0125">gpt-3.5-turbo-0125</option>
                <option value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</option>
                <option value="gpt-3.5-turbo-instruct">gpt-3.5-turbo-instruct</option>
                {/* Add other options here */}
              </select>
            </td>
          </tr>
          <tr>
            <td>Default Language</td>
            <td>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                style={{ width: '400px' }}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="french">French</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Creativity</td>
            <td>
              <select
                name="creativity"
                value={settings.creativity}
                onChange={handleChange}
                style={{ width: '400px' }}
              >
                <option value="regular">Regular</option>
                <option value="high">High</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Settings;
