import { displayMessage } from "./utils.js";

export default function useManageBids() {
    const editingBid = Vue.reactive({ amount: '' });
    const bidsData = Vue.reactive({ message: '' });

    const startNewBid = (auction) => {
        editingBid.auctionId = auction.auctionId;
        editingBid.amount = auction.currentPrice + 1;
    };

    const saveBid = async (auction) => {
        const auctionId = auction.auctionId;
        try {
            const response = await fetch(`/api/auctions/${auctionId}/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ bidAmount: editingBid.amount }),
            });
            const result = await response.json();
            if (!response.ok) {
                bidsData.message = displayMessage(result.message, 'danger');
            } else {
                auction.currentPrice = editingBid.amount;
                bidsData.message = displayMessage(result.message, 'success');
            }
            editingBid.auctionId = null;
            editingBid.amount = '';
        } catch (error) {
            console.error("Error placing bid:", error);
            bidsData.message = displayMessage('Error placing bid.', 'danger');
        }

        setTimeout(() => {
            bidsData.message = '';
        }, 5000);
    };

    return {
        editingBid,
        bidsData,
        startNewBid,
        saveBid,
    };
}
