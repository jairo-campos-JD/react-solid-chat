import React, { Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// Components
import { Loader } from '../../../../components';

import { Profile } from '../../../../utils';
import './styles.scss';

class DashboardComponent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        data: [],
        images: []
      }
    };
  }
  componentDidMount() {
    this.loadProfile();
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    /**
     * Save updated fields values to send over solid
    */
    this.setState({
      loading: false,
      updatedFields: {
        ...this.state.updatedFields,
        [name]: value
      }
    });
  }

  handleSubmit = async(e) => {
    e.preventDefault();
    await Profile.updateProfile(this.state.fields.data, this.state.updatedFields);
    // Update Origin profile data with new field value
    const data = Profile.updateState(this.state.fields.data, this.state.updatedFields);
    // Clean updatedFields after submit the new values(like reset form to avoid solid issues)
    this.setState({ 
      updatedFields: {},
      fields: {
        ...this.state.fields, 
        data 
      } 
    });
  }

  clearValue(value: string) {
    if (value.includes('mailto:')) {
      return value.split(':')[1];
    }
    return value;
  }

  async loadProfile() {
    this.setState({ loading: true });
    const fields = await Profile.getProfileCard();
    this.setState({ fields, loading: false });
  }
  render() {
    return (
      <div className="app-profile-card">
        <h1>Profile</h1>
        <div className="profile-fields-container">
          <div className="profile-image-container pure-g">
          {
                this.state.fields.images.map((field, index) => {
                  return (
                    <div className="pure-u-1-3 image" key={ index }><img src={ field.object.value }  /></div>
                  );
                })
              }
          </div>
          <div className="profile-form-container">
            <form className="pure-g" onSubmit={ this.handleSubmit } >
              {
                this.state.fields.data.map((field, index) => {
                  return (
                    <div className="pure-u-24-24 pure-u-sm-12-24 profile-field" key={ index }>
                      <div className="pure-g">
                        <div className="pure-u-3-24 icon-container">
                          { field.icon && field.icon !== '' && <FontAwesomeIcon icon={ field.icon } className="profile-icon" /> }
                        </div>
                        <div className="pure-u-21-24">
                          <input
                            type="text"
                            value={ this.state.updatedFields && this.state.updatedFields[field.label]
                              || field.object && this.clearValue(field.object.value) }
                            name={ field.label } onChange={this.handleInputChange} />
                          </div>
                        </div>
                    </div>
                  );
                })
              }
              <div className="button-container pure-u-24-24">
                <button type="submit" className="btn btn-solid">Save</button>
              </div>
            </form>
          </div>
        </div>
        <Loader show={ this.state.loading } />
      </div>
    );
  }
}

export default DashboardComponent;