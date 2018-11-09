import React, { Component} from 'react';
import Select from 'react-select';

type Props = {
  className: string,
  placeholder: string,
  options: Array<Object>,
  onChange: () => void,
  components?: any
}

import './styles.scss';

class ProviderSelect extends Component<Props>{
  renderOptions(): React.Element {
     return ({ innerProps, isDisabled, innerRef, data }) => !isDisabled ? (
        <div ref={innerRef} {...innerProps} className="option">
          <img src={data.image } className="icon"/>
          <span>{ data.label }</span>
        </div>
      ) : null;
  }
  render(){
    const { className, placeholder, options, components, onChange } = this.props;
    return (
      <Select
        {...{
          placeholder,
          className: `provider-select ${className}`,
          options,
          components: components ? { Option: this.renderOptions()  } : null,
          onChange
        }}
      />
    );
  }
}

export default ProviderSelect;