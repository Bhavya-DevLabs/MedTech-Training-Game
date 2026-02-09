import { State } from '../core/state.js';

export const LoginPage = {
  render() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1>Welcome to Dualto Training</h1>
            <p>Enter your details to begin</p>
          </div>
          
          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="userName">Your Name</label>
              <input 
                type="text" 
                id="userName" 
                placeholder="Enter your name" 
                required
                autocomplete="off"
              />
            </div>
            
            <div class="form-group">
              <label for="userTeam">Your Team</label>
              <select id="userTeam" required>
                <option value="">Select your region</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>
            
            <button type="submit" class="btn-primary"><i class="fa-solid fa-play"></i> Start Training</button>
          </form>
        </div>
      </div>
    `;
    
    this.attachEvents();
  },
  
  attachEvents() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('userName').value.trim();
      const team = document.getElementById('userTeam').value;
      
      if (name && team) {
        State.set({
          user: { name, team }
        });
        
        window.location.hash = '#/game';
      }
    });
  }
};
// Name + Team entry modal - MANDATORY, cannot skip
