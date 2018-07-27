import { Contract, providers as ethersProviders, utils } from 'ethers';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { IReduxState } from '../../redux/configureStore';

interface IOwnProps {
  provider: ethersProviders.Web3Provider;
}

interface IStateProps {}

interface IDispatchProps {}

type Props = IStateProps & IDispatchProps & IOwnProps;

interface IState {
  account?: string;
  allocation?: string | boolean;
  buttonActive?: boolean;
  contract?: Contract;
  transaction?: any;
}

class HomePage extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      buttonActive: true
    };
  }

  public async componentDidMount() {
    const data: IState = await this.getData();
    this.setState(data);
  }

  public withdrawTokens = async () => {
    this.setState({ buttonActive: false });
    const { contract } = this.state;
    if (contract) {
      try {
        const transaction = await contract.withdrawTokens();
        this.setState({
          transaction
        });
      } finally {
        this.setState({ buttonActive: true });
      }
    } else {
      this.setState({ buttonActive: true });
    }
  };

  public render() {
    const { account, allocation, buttonActive, transaction } = this.state;
    return (
      <div className="Page">
        <h2>Hi {account},</h2>
        {allocation === false && (
          <p style={{ marginTop: '2em' }}>
            During the bounty campaign for the DataBrokerDao token sale, you
            earned no DTX or you already withdrew them. If you have questions,
            please get in contact via the{' '}
            <a href="https://t.me/DataBrokerDAOBounty">
              Bounty Telegram channel
            </a>.
          </p>
        )}
        {allocation && (
          <div>
            <p style={{ marginTop: '2em' }}>
              During the bounty campaign for the DataBrokerDao token sale, you
              earned <strong>{allocation} DTX</strong>. If you have questions
              about the amount, please get in contact via the{' '}
              <a href="https://t.me/DataBrokerDAOBounty">
                Bounty Telegram channel
              </a>.
            </p>
            <p>
              You can now withdraw them by pressing the button below, which will
              send a transaction to the smart contract transferring the DTX
              tokens to your account.
            </p>
            {!transaction &&
              buttonActive && (
                <button
                  disabled={!buttonActive}
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={this.withdrawTokens}
                >
                  Withdraw tokens
                </button>
              )}
            {!transaction &&
              !buttonActive && (
                <div>
                  <div className="progress" style={{ marginBottom: '2em' }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: '75%' }}
                    />
                  </div>
                  <p style={{ fontWeight: 700 }}>
                    Your transaction has been sent to the chain and is waiting
                    to be accepted in the transaction pool. This might take a
                    few minutes. This page will update when completed.
                  </p>
                </div>
              )}
            {transaction && (
              <div>
                <div className="progress" style={{ marginBottom: '2em' }}>
                  <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    style={{ width: '100%' }}
                  />
                </div>
                <p style={{ fontWeight: 700 }}>
                  Your transaction has been sent to the chain and you can follow
                  along with{' '}
                  <a href={`https://etherscan.io/tx/${transaction.hash}`}>
                    the processing of this transaction on Etherscan
                  </a>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  public async getData(): Promise<IState> {
    const { provider } = this.props;
    if (provider) {
      const accounts = await provider.listAccounts();
      const account = accounts[0];

      const contract = new Contract(
        '0x8bf82372f60100399dc633581ef4a40366a98750',
        abi,
        provider.getSigner()
      );
      const rawAllocation = await contract.balances(account);
      let allocation;
      if (rawAllocation.isZero()) {
        allocation = false;
      } else {
        allocation = utils.formatEther(rawAllocation, { commify: true });
      }
      return {
        account,
        allocation,
        contract
      };
    }
    return {};
  }
}

function mapStateToProps(state: IReduxState, ownProps: IOwnProps): IStateProps {
  return {};
}

function mapDispatchToProps(
  dispatch: Redux.Dispatch,
  ownProps: IOwnProps
): IDispatchProps {
  return {};
}

export default connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

const abi = [
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'balances',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'allocatedTotal',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenContract',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'withdrawTokens',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_recipients', type: 'address[]' },
      { name: '_amounts', type: 'uint256[]' }
    ],
    name: 'allocateTokens',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '_tokenAddress', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'previousOwner', type: 'address' }],
    name: 'OwnershipRenounced',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'previousOwner', type: 'address' },
      { indexed: true, name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  }
];
