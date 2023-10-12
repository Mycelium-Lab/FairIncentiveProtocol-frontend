import { v4 as uuidv4 } from 'uuid';

const userTable = [
        {
            id: uuidv4(),
            name: 'ID',
        },
        {
            id: uuidv4(),
            name: 'Name',
        },
        {
            id: uuidv4(),
            name: 'Wallet',
        },
        {
            id: uuidv4(),
            name: 'Tokens',
        },
        {
            id: uuidv4(),
            name: 'Rewards',
        },
        {
            id: uuidv4(),
            name: 'Actions',
        },
    ]

const tokenTable = [
        {
            id: uuidv4(),
            name: 'Token',
        },
        {
            id: uuidv4(),
            name: 'Balance',
        },
        {
            id: uuidv4(),
            name: 'Price',
        },
        {
            id: uuidv4(),
            name: 'Supply',
        },
        {
            id: uuidv4(),
            name: 'Actions',
        },
    ]

    const blacklistTable = [
        {
            id: uuidv4(),
            name: 'Select',
        },
        {
            id: uuidv4(),
            name: 'Wallet',
        },
        {
            id: uuidv4(),
            name: 'Block Date',
        },
    ]

   const  nftsTable = [
        {
            id: uuidv4(),
            name: 'Name',
        },
        {
            id: uuidv4(),
            name: 'NFT items',
        },
        {
            id: uuidv4(),
            name: 'Info',
        },
        {
            id: uuidv4(),
            name: 'Actions',
        },
    ]

    const rewardsTable = [
        {
            id: uuidv4(),
            name: 'Status',
        },
        {
            id: uuidv4(),
            name: 'Name',
        },
        {
            id: uuidv4(),
            name: 'Reward',
        },
        {
            id: uuidv4(),
            name: 'Description',
        },
        {
            id: uuidv4(),
            name: 'Rewarded'
        },
        {
            id: uuidv4(),
            name: 'Actions',
        },
    ]

    const rewardEventsTable = [
        {
            id: uuidv4(),
            name: 'ID',
        },
        {
            id: uuidv4(),
            name: 'Status',
        },
        {
            id: uuidv4(),
            name: 'Reward',
        },
        {
            id: uuidv4(),
            name: 'Distributed',
        },
        {
            id: uuidv4(),
            name: 'User',
        },
        {
            id: uuidv4(),
            name: 'Actions',
        },
    ]

    const paymentMethodsTable = [
        {
            id: uuidv4(),
            name: 'Card',
        },
        {
            id: uuidv4(),
            name: 'Expire date',
        },
        {
            id: uuidv4(),
            name: 'Status',
        },
        {
            id: uuidv4(),
            name: 'Actions',
        },
    ]

    const billingHistoryTable = [
        {
            id: uuidv4(),
            name: 'Date',
        },
        {
            id: uuidv4(),
            name: 'Description',
        },
        {
            id: uuidv4(),
            name: 'Amount',
        },
        {
            id: uuidv4(),
            name: 'Actions',
        },
    ]

    const teamTable = [
        {
            id: uuidv4(),
            name: 'Name',
        },
        {
            id: uuidv4(),
            name: 'Role',
        },
        {
            id: uuidv4(),
            name: 'Status',
        },
        {
            id: uuidv4(),
            name: 'Actions',
        },
    ]

export {
    userTable, tokenTable, blacklistTable, nftsTable, 
    rewardsTable, rewardEventsTable, paymentMethodsTable, billingHistoryTable,
    teamTable
}