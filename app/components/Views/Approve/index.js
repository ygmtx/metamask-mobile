import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { getApproveNavbar } from '../../UI/Navbar';
import { colors, fontStyles } from '../../../styles/common';
import { connect } from 'react-redux';
import WebsiteIcon from '../../UI/WebsiteIcon';
import { getHost } from '../../../util/browser';
import TransactionDirection from '../TransactionDirection';
import contractMap from 'eth-contract-metadata';
import { safeToChecksumAddress } from '../../../util/address';
import Engine from '../../../core/Engine';

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: colors.white,
		flex: 1
	},
	icon: {
		borderRadius: 32,
		height: 64,
		width: 64
	},
	section: {
		flexDirection: 'column',
		paddingHorizontal: 24,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: colors.grey200
	},
	title: {
		...fontStyles.normal,
		fontSize: 24,
		textAlign: 'center',
		marginBottom: 16,
		color: colors.black,
		lineHeight: 34
	},
	explanation: {
		...fontStyles.normal,
		fontSize: 14,
		textAlign: 'center',
		color: colors.grey500,
		lineHeight: 20
	},
	editPermissionText: {
		...fontStyles.bold,
		color: colors.blue,
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center'
	},
	viewDetailsText: {
		...fontStyles.normal,
		color: colors.blue,
		fontSize: 12,
		textAlign: 'center'
	},
	actionTouchable: {
		flexDirection: 'column',
		alignItems: 'center'
	},
	websiteIconWrapper: {
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 16
	},
	sectionTitleText: {
		...fontStyles.bold,
		fontSize: 14,
		marginVertical: 6
	},
	sectionExplanationText: {
		...fontStyles.normal,
		fontSize: 12,
		color: colors.grey500,
		marginVertical: 6
	},
	editText: {
		...fontStyles.normal,
		color: colors.blue,
		fontSize: 12
	},
	fiatFeeText: {
		...fontStyles.bold,
		fontSize: 18,
		color: colors.black
	},
	feeText: {
		...fontStyles.normal,
		fontSize: 14,
		color: colors.grey500
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	column: {
		flexDirection: 'column'
	},
	sectionLeft: {
		flex: 0.7,
		marginVertical: 6
	},
	sectionRight: {
		flex: 0.3,
		marginVertical: 6,
		alignItems: 'flex-end'
	}
});

/**
 * PureComponent that manages transaction approval from the dapp browser
 */
class Approve extends PureComponent {
	static navigationOptions = ({ navigation }) => getApproveNavbar('approve.title', navigation);

	static propTypes = {
		/**
		 * Transaction state
		 */
		transaction: PropTypes.object.isRequired
	};

	state = {
		host: undefined,
		tokenSymbol: undefined
	};

	componentDidMount = async () => {
		const {
			transaction: { origin, to }
		} = this.props;
		const { AssetsContractController } = Engine.context;
		const host = getHost(origin);
		let tokenSymbol;
		const contract = contractMap[safeToChecksumAddress(to)];
		if (!contract) {
			tokenSymbol = await AssetsContractController.getAssetSymbol(to);
		} else {
			tokenSymbol = contract.symbol;
		}
		this.setState({ host, tokenSymbol });
	};

	render = () => {
		const { transaction } = this.props;
		const { host, tokenSymbol } = this.state;
		return (
			<SafeAreaView style={styles.wrapper}>
				<TransactionDirection />
				<View style={styles.section}>
					<View style={styles.websiteIconWrapper}>
						<WebsiteIcon style={styles.icon} url={transaction.origin} title={host} />
					</View>
					<Text style={styles.title}>{`Allow ${host} to access your ${tokenSymbol}?`}</Text>
					<Text
						style={styles.explanation}
					>{`Do you trust this site? By granting this permission, you're allowing ${host} to withdraw you ${tokenSymbol} and automate transactions for you.`}</Text>
					<TouchableOpacity style={styles.actionTouchable}>
						<Text style={styles.editPermissionText}>Edit permission</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.section}>
					<View style={styles.row}>
						<Text style={[styles.sectionTitleText, styles.sectionLeft]}>Transaction fee</Text>
						<TouchableOpacity style={styles.sectionRight}>
							<Text style={styles.editText}>Edit</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.row}>
						<View style={[styles.sectionLeft, styles.row]}>
							<Text style={[styles.sectionExplanationText]}>
								A transaction fee is associated ith this permission. Learn why
							</Text>
						</View>
						<View style={[styles.column, styles.sectionRight]}>
							<Text style={styles.fiatFeeText}>$fiat</Text>
							<Text style={styles.feeText}>fee</Text>
						</View>
					</View>
					<TouchableOpacity style={styles.actionTouchable}>
						<Text style={styles.viewDetailsText}>View details</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	};
}

const mapStateToProps = state => ({
	transaction: state.transaction
});

export default connect(mapStateToProps)(Approve);
