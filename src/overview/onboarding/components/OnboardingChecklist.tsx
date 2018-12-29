import React from 'react'
import { connect } from 'react-redux'

import { Checkbox } from '../../../common-ui/components'
import * as constants from '../constants'
import { browser } from 'webextension-polyfill-ts'
import { getLocalStorage, setLocalStorage } from 'src/util/storage'

import * as actions from '../actions'
import * as selectors from '../selectors'

const styles = require('./OnboardingChecklist.css')

export interface StateProps {
    onboardingStages: {
        annotationStage: string
        powerSearchStage: string
    }
}

export interface DispatchProps {
    fetchOnboardingStages: () => void
}

export interface OwnProps {}

export type Props = StateProps & DispatchProps & OwnProps

class OnboardingChecklist extends React.Component<Props> {
    async componentDidMount() {
        await this.props.fetchOnboardingStages()
    }

    handleStepOne = async () => {
        if (this.props.onboardingStages.annotationStage === 'DONE') {
            return
        }

        const url = constants.ANNOTATION_DEMO_URL
        await setLocalStorage(
            constants.STORAGE_KEYS.onboardingDemo.step1,
            'highlight_text',
        )
        await browser.tabs.create({
            url,
        })
    }

    handleStepTwo = async () => {
        if (this.props.onboardingStages.powerSearchStage === 'DONE') {
            return
        }

        const url = constants.ANNOTATION_DEMO_URL
        await setLocalStorage(
            constants.STORAGE_KEYS.onboardingDemo.step2,
            'redirected',
        )
        await browser.tabs.create({
            url,
        })
    }

    render() {
        const {
            annotationStage,
            powerSearchStage,
        } = this.props.onboardingStages
        return (
            <React.Fragment>
                <p className={styles.title}>HOW TO GET STARTED</p>
                <p className={styles.subtext}>
                    Complete 30 sec interactive tutorial for the main features.
                </p>
                <div className={styles.checklist}>
                    <Checkbox
                        isChecked={annotationStage === 'DONE'}
                        handleChange={() => null}
                        id="step1"
                    >
                        {' '}
                        <span
                            className={styles.checklistText}
                            onClick={this.handleStepOne}
                        >
                            Make your first web annotation{' '}
                        </span>
                    </Checkbox>
                </div>
                <div className={styles.checklist}>
                    <Checkbox
                        isChecked={false}
                        handleChange={() => null}
                        id="step3"
                    >
                        {' '}
                        <span className={styles.checklistText}>
                            Tag websites & sort them into collections{' '}
                        </span>
                    </Checkbox>
                </div>
                <div className={styles.checklist}>
                    <Checkbox
                        isChecked={powerSearchStage === 'DONE'}
                        handleChange={() => null}
                        id="step2"
                    >
                        {' '}
                        <span
                            className={styles.checklistText}
                            onClick={this.handleStepTwo}
                        >
                            Do your first power search{' '}
                        </span>
                    </Checkbox>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    onboardingStages: selectors.onboardingStages(state),
})

const mapDispatchToPrpos = dispatch => ({
    fetchOnboardingStages: () => dispatch(actions.fetchOnboardingStages()),
})

export default connect(
    mapStateToProps,
    mapDispatchToPrpos,
)(OnboardingChecklist)
