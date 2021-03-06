import React from 'react'
import PropTypes from 'prop-types'

import * as sequelize4 from '../../templates/sequelize-4.js'
import Button from '../components/Button.jsx'
import ToolBelt from '../components/ToolBelt.jsx'
import { CodeFlyout } from '../components/Code.jsx'

import { DATA_TYPE_OPTIONS } from '../../constants.js'

export default class Model extends React.Component {
  constructor (props) {
    super(props)
    this.editButtonRef = React.createRef()
    this.state = { codeOpen: false }
  }

  componentDidMount () {
    if (this.props.fromEdit) {
      this.editButtonRef.current.focus()
      this.props.clearFromEdit()
    }
  }

  toggleCode = () => this.setState({ codeOpen: !this.state.codeOpen })

  render () {
    return (
      <React.Fragment>
        <main className='main-content model-view'>
          <div className='content-wrapper'>
            <h2 className='title'>{this.props.model.name} Model</h2>
            <ToolBelt>
              <Button
                icon='back'
                label='Back'
                onClick={this.props.goToModels}
              />
              <Button
                ref={this.editButtonRef}
                icon='edit'
                label='Edit'
                onClick={this.props.editModel}
              />
              <Button icon='code' label='Code' onClick={this.toggleCode} />
            </ToolBelt>
            <h3 className='fields-title subtitle'>Fields</h3>
            {this.props.model.fields.length === 0 ? (
              <p>No Fields</p>
            ) : (
              <table className='fields-table' key='abc'>
                <thead>
                  <tr>
                    <th className='fields-table__name-header fields-table__cell'>
                      Name
                    </th>
                    <th className='fields-table__cell'>Type</th>
                    <th className='fields-table__cell'>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.model.fields.map(field => (
                    <tr key={field.id}>
                      <td className='fields-table__name-cell fields-table__cell'>
                        {field.name}
                      </td>
                      <td className='fields-table__cell'>
                        {DATA_TYPE_OPTIONS[field.type]}
                      </td>
                      <td className='fields-table__cell'>
                        {showFieldOptions(field)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
        <CodeFlyout
          open={this.state.codeOpen}
          onClose={this.toggleCode}
          newMessage={this.props.newMessage}
          fileItem={sequelize4.modelFile({
            model: this.props.model,
            config: this.props.config
          })}
        />
      </React.Fragment>
    )
  }
}

Model.propTypes = {
  fromEdit: PropTypes.bool.isRequired,
  clearFromEdit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  goToModels: PropTypes.func.isRequired,
  editModel: PropTypes.func.isRequired,
  newMessage: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
}

const showFieldOptions = field => {
  const options = {
    primaryKey: 'PK',
    required: 'REQ',
    unique: 'UQ'
  }

  const display = Object.entries(options)
    .filter(([option, _]) => field[option])
    .map(([_, text]) => text)
    .join(', ')

  return display
}
