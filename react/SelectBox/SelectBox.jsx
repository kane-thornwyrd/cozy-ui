import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import styles from './styles.styl'
import Icon from '../Icon'
import { dodgerBlue, silver, coolGrey } from '../palette'
import withBreakpoints from '../helpers/withBreakpoints'
import classNames from 'classnames'

const customStyles = {
  container: base => ({
    ...base,
    maxWidth: '30rem'
  }),
  control: (base, state) => ({
    ...base,
    backgroundColor: 'white',
    border: state.isFocused
      ? `.0625rem solid ${dodgerBlue}`
      : `.0625rem solid ${silver}`,
    ':hover': {
      borderColor: coolGrey
    },
    borderRadius: '.1875rem',
    boxShadow: 'unset',
    padding: '.503rem .5rem'
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    backgroundImage: state.menuIsOpen
      ? 'url("../../assets/icons/ui/top-select.svg")'
      : 'url("../../assets/icons/ui/bottom-select.svg")',
    backgroundSize: '.875rem',
    height: '.875rem',
    marginRight: '.75rem',
    padding: 0,
    width: '.875rem'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  valueContainer: base => ({
    ...base,
    color: 'black'
  }),
  menu: base => ({
    ...base,
    zIndex: 10
  })
}

const reactSelectControl = CustomControl => ({
  innerProps,
  innerRef,
  children
}) => (
  <div {...innerProps} ref={innerRef}>
    {CustomControl}
    <div className={styles['select-control__input']}>{children}</div>
  </div>
)

export const withPrefix = (reactSelectCx, className) => {
  // react-select implement a classnames function https://git.io/fhT8S
  // it's not the same as classnames library (https://www.npmjs.com/package/classnames)
  // 1st parameter is bound by react-select with prefix https://git.io/fhkIj
  // 2nd parameter is cssKey. We don't need it so it's set to null
  // 3rd parameter is used to add prefix but we don't want to stick with
  //   webpack className so we add space (' ') in front of it
  const classNameWithPrefix = reactSelectCx(null, { [` ${className}`]: true })

  // When we don't use classNamePrefix cx return '' so we verify to send
  // className
  return classNameWithPrefix === '' ? className : classNameWithPrefix
}

const Option = ({
  children,
  isSelected,
  isFocused,
  isDisabled,
  innerProps,
  innerRef,
  labelComponent,
  cx,
  withCheckbox
}) => (
  <div
    {...innerProps}
    ref={innerRef}
    className={withPrefix(
      cx,
      classNames(styles['select-option'], {
        [styles['select-option--selected']]: isSelected && !withCheckbox,
        [styles['select-option--focused']]: isFocused,
        [styles['select-option--disabled']]: isDisabled
      })
    )}
  >
    {withCheckbox && (
      <input
        type="checkbox"
        readOnly
        checked={isSelected}
        className={withPrefix(cx, styles['select-option__checkbox'])}
      />
    )}
    <span className={withPrefix(cx, styles['select-option__label'])}>
      <span className={withPrefix(cx, 'u-ellipsis')}>
        {labelComponent ? labelComponent : children}
      </span>
      {labelComponent ? children : false}
    </span>
    {!withCheckbox && (
      <span className={withPrefix(cx, styles['select-option__checkmark'])}>
        {isSelected && (
          <Icon
            icon="check-circleless"
            color={dodgerBlue}
            className={withPrefix(cx, 'u-ph-half')}
          />
        )}
      </span>
    )}
  </div>
)

Option.propTypes = {
  withCheckbox: PropTypes.bool,
  labelComponent: PropTypes.node
}

Option.defaultProps = {
  withCheckbox: false
}

const CheckboxOption = ({ ...props }) => <Option {...props} withCheckbox />

CheckboxOption.propTypes = {}

const ActionsOption = ({ actions, ...props }) => (
  <Option {...props} labelComponent={props.children}>
    <span className={withPrefix(props.cx, styles['select-option__actions'])}>
      {actions.map((action, index) => (
        <Icon
          key={index}
          icon={action.icon}
          color={props.isFocused ? coolGrey : silver}
          className={withPrefix(props.cx, 'u-ph-half')}
          onClick={e => {
            e.stopPropagation()
            action.onClick(props)
          }}
        />
      ))}
    </span>
  </Option>
)

ActionsOption.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      onClick: PropTypes.func
    })
  )
}

ActionsOption.defaultProps = {
  actions: []
}

class SelectBox extends Component {
  state = { isOpen: false }
  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const {
      className,
      components,
      styles: reactSelectStyles,
      breakpoints: { isMobile },
      classNamePrefix,
      ...props
    } = this.props
    const showOverlay = this.state.isOpen && isMobile
    return (
      <ReactSelect
        components={{ Option, ...components }}
        styles={{ ...customStyles, ...reactSelectStyles }}
        onMenuOpen={this.handleOpen}
        onMenuClose={this.handleClose}
        {...props}
        className={classNames(
          {
            [styles['select__overlay']]: showOverlay
          },
          className
        )}
        // react-select temporarily adds className to its innerComponents
        // but this behavior will soon be removed. For the moment, we
        // cancel it by setting it to empty string
        classNamePrefix={classNamePrefix || ''}
      />
    )
  }
}

SelectBox.propTypes = {
  components: PropTypes.object,
  styles: PropTypes.object
}

SelectBox.defaultProps = {
  components: {},
  styles: {}
}

const components = ReactSelect.components

export default withBreakpoints()(SelectBox)
export { Option, CheckboxOption, ActionsOption, reactSelectControl, components }
