export default class DrinkDisplay extends HTMLElement {
    constructor(config) {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.config = config;

        this.id = 'display';
        this.shadowRoot.appendChild(this.renderStyle());
        this.appendChild(this.renderHtml(config));
    }

    renderHtml(config) {
        let container = document.createElement('div');

        container.innerHTML = `
            <div class="drink-container">
                <h2 class="drink-title">${config.displayName}</h2>
                <img class="drink-image" src="/api/drink-image/${config.id}"/>
                <div class="drink-description">${config.description || 'No Description!'}</div>
                <label>Pin:</label> <input type="number" disabled="disabled" class="drink-description" value="${config.pin || -1}"></input>
                
                <div class="">
                    <span class="fa-stack fa-2x drink-buttons"  onmousedown="edit('${config.id}')" ontouchstart="edit('${config.id}')" style="cursor: pointer"
                         title="Edit">
                      <i class="fa fa-square-o fa-stack-2x"></i>
                      <i class="fa fa-cog fa-1x"></i>
                    </span>
                </div>
            </div>
        `;

        return container;

    }

    edit (id) {
        console.log('fuckery');
    }

    renderStyle() {
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            #display {
                margin-left: 30%;
                margin-right: 30%;
            }
            
            #display .drink-image {
                width: 25%;
            }
            
            #display .drink-title {
                font-style: italic;
            }
            
            #display .drink-description {
                margin: 10px 0 10px 0;
            }
            
            #display .drink-description textarea {
                width: 75%;
            }
            
            #display .drink-container {
                padding: 10px;
                border-color: #31708f;
                border-style: solid;
                border-radius: 10px;
                margin: 5px;
            }
            
            #display .drink-buttons {
                cursor: pointer;
                margin: 5px;
            }
            
            #display .drink-ingredients {
            
            }
            
            #display .drink-ingredient {
            
            }
            
            #display .drink-part {
            
            }
            
            #display .drink-table {
            }
          `;
        return styleTag
    }
};
