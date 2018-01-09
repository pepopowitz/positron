import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { findIndex, findLastIndex } from 'lodash'
import colors from '@artsy/reaction-force/dist/Assets/Colors'
import { IconDrag, IconRemove } from '@artsy/reaction-force/dist/Components/Publishing'

import SectionImageCollection from '../sections/image_collection/index.coffee'
import SectionText from '../sections/text/index.coffee'
import { SectionEmbed } from '../sections/embed/index'
import { SectionVideo } from '../sections/video/index'

export class SectionContainer extends Component {
  static propTypes = {
    article: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    editing: PropTypes.bool,
    index: PropTypes.number.isRequired,
    isHero: PropTypes.bool,
    onRemoveHero: PropTypes.func,
    onSetEditing: PropTypes.func.isRequired,
    section: PropTypes.object.isRequired,
    sections: PropTypes.array.isRequired
  }

  onSetEditing = () => {
    const {
      editing,
      index,
      onSetEditing
    } = this.props

    const setEditing = editing ? null : index
    onSetEditing(setEditing)
  }

  onRemoveSection = (e) => {
    const {
      section,
      isHero,
      onRemoveHero
    } = this.props

    e.stopPropagation()
    section.destroy()

    if (isHero) {
      onRemoveHero()
    }
  }

  getContentStartEnd = () => {
    const { sections } = this.props
    const types = sections && sections.map((section, i) => {
      return { type: section.get('type'), index: i }
    })
    const start = findIndex(types, {type: 'text'})
    const end = findLastIndex(types, {type: 'text'})

    return { start, end }
  }

  getSectionComponent = () => {
    const { section } = this.props
    const sectionProps = this.getSectionProps()

    switch (section.get('type')) {
      case 'embed': {
        return <SectionEmbed {...sectionProps} />
      }
      case 'image':
      case 'image_set':
      case 'image_collection': {
        return <SectionImageCollection {...sectionProps} />
      }
      case 'text': {
        return <SectionText {...sectionProps} />
      }
      case 'video': {
        return <SectionVideo {...sectionProps} />
      }
      default: {
        return <div>This has been deprecated :(</div>
      }
    }
  }

  getSectionProps = () => {
    const {
      article,
      channel,
      editing,
      index,
      isHero,
      onSetEditing,
      section,
      sections
    } = this.props

    const { end, start } = this.getContentStartEnd()

    return {
      article,
      channel,
      editing,
      index,
      isHero,
      onSetEditing,
      section,
      sections,
      setEditing: this.setEditing,
      isContentStart: start === index,
      isContentEnd: end === index
    }
  }

  render () {
    const {
      editing,
      isHero,
      section
    } = this.props

    return (
      <div className='SectionContainer'
        data-editing={editing}
        data-layout={section.get('layout') || 'column_width'}
        data-type={section.get('type')}
      >
        <div
          className='SectionContainer__hover-controls'
          onClick={this.onSetEditing}
        >
          {!isHero &&
            <div className='button-drag'>
              <IconDrag background={colors.grayMedium} />
            </div>
          }
          <div className='button-remove'
            onClick={this.onRemoveSection}
          >
            <IconRemove background={colors.grayMedium} />
          </div>
        </div>

        {this.getSectionComponent()}

        <div
          className='SectionContainer__container-bg'
          onClick={this.onSetEditing}
        />
      </div>
    )
  }
}
