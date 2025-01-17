import { displayMessage } from "./utils.js";

export default function useManageAuctions() {
    const noAuctionsMessage = Vue.ref(null);
    const auctionData = Vue.reactive({
        title: '',
        description: '',
        endDate: '',
        startingPrice: '',
        message: '',
        searchTitle: '',
    });
    const auctions = Vue.ref([]);
    const editingAuction = Vue.reactive({
        title: '',
        description: '',
    });
    const bids = Vue.ref([]);
    const selectedAuctionId = Vue.ref(null);
    const showBidsDetails = Vue.ref(false);
    const bidsTable = Vue.ref(null);
    const bidsTableHome = Vue.ref(null);

    const isCreator = (auctionCreator) => {
        const authenticatedUser = localStorage.getItem('username');
        return auctionCreator === authenticatedUser;
    };
    
    const getAllAuctions = async () => {
        try {
            const response = await fetch(`/api/auctions/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching auctions");
            }
            const data = await response.json();
            if (data.auctions && data.auctions.length === 0) {
                auctions.value = [];
                noAuctionsMessage.value = data.message;
            } else {
                auctions.value = data;
                noAuctionsMessage.value = null;
            }
        } catch (error) {
            console.error("Error fetching auctions:", error);
        }
    };

    const searchAuction = async () => {
        try {
            const response = await fetch(`/api/auctions/?q=${ auctionData.searchTitle }`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching auctions");
            }
            const data = await response.json();
            if (data.auctions && data.auctions.length === 0) {
                auctions.value = [];
                noAuctionsMessage.value = data.message;
            } else {
                auctions.value = data;
                noAuctionsMessage.value = null;
            }
        } catch (error) {
            console.error("Error fetching auctions:", error);
        }
    };

    const isEndDateValid = (endDate) => {
        const currentDate = new Date();
        return new Date(endDate) > currentDate;
    };

    const editAuction = (auction) => {
        editingAuction.auctionId = auction.auctionId;
        editingAuction.title = auction.title;
        editingAuction.description = auction.description;
    };

    const saveAuction = async (auctionId) => {
        try {
            const response = await fetch(`/api/auctions/${auctionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    title: editingAuction.title,
                    description: editingAuction.description,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                auctionData.message = displayMessage(result.message, 'success');
                getAllAuctions();
            } else {
                auctionData.message = displayMessage(result.message, 'danger');
            }
            
            editingAuction.auctionId = null;
        } catch (error) {
            console.error("Error saving auction:", error);
            auctionData.message = displayMessage('Error saving auction, please try again later.', 'danger');
        }

        setTimeout(() => {
            auctionData.message = '';
        }, 5000);
    };

    const newAuction = async () => {
        try {
            if (!isEndDateValid(auctionData.endDate)) {
                auctionData.message = displayMessage("End Date must be in the future", 'danger');
            }
            else if(auctionData.startingPrice <= 0) {
                auctionData.message = displayMessage("Starting price must be greater than 0", 'danger');
            }
            else {
                const response = await fetch('/api/auctions/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        title: auctionData.title,
                        description: auctionData.description,
                        endDate: auctionData.endDate,
                        startingPrice: auctionData.startingPrice,
                    }),
                });
                const result = await response.json();
                if (!response.ok) {
                    auctionData.message = displayMessage(result.message, 'danger');
                }
                getAllAuctions();
                auctionData.message = displayMessage(result.message, 'success');
                auctionData.title = '';
                auctionData.description = '';
                auctionData.endDate = '';
                auctionData.startingPrice = '';
            }
        } catch (error) {
            console.error("Error creating auction:", error);
        }

        setTimeout(() => {
            auctionData.message = '';
        }, 5000);
    };

    const deleteAuction = async (auctionId) => {
        try {
            const response = await fetch(`/api/auctions/${auctionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const result = await response.json();
            console.log(result);
            if (response.ok) {
                auctionData.message = displayMessage(result.message, 'success');
                auctions.value = auctions.value.filter(auction => auction.auctionId !== auctionId);
            } else {
                auctionData.message = displayMessage(result.message, 'danger');
            }
        } catch (error) {
            console.error("Error deleting auction:", error);
            auctionData.message = displayMessage('Error deleting auction, please try again later.', 'danger');
        }

        setTimeout(() => {
            auctionData.message = '';
        }, 5000);
    };

    const scrollToBidsTable = (targetTable) => {
        if (targetTable && targetTable.value) {
            targetTable.value.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getBidsForAuction = async (auctionId) => {
        try {
            const response = await fetch(`/api/auctions/${auctionId}/bids`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching user details");
            }
            bids.value = await response.json();
            selectedAuctionId.value = auctionId;
            showBidsDetails.value = true;

            setTimeout(() => {
                scrollToBidsTable(bidsTableHome);
                scrollToBidsTable(bidsTable);
            }, 100);
        } catch (error) {
            console.error("Error fetching user details:", error);
            noAuctionsMessage.value = "Error fetching auctions. Please try again later.";
        }
    };

    const closeBidsDetails = () => {
        bids.value = [];
        selectedAuctionId.value = null;
        showBidsDetails.value = false;
    };

    return {
        noAuctionsMessage,
        auctionData,
        auctions,
        editingAuction,
        bids,
        selectedAuctionId,
        showBidsDetails,
        bidsTable,
        bidsTableHome,
        isCreator,
        getAllAuctions,
        searchAuction,
        isEndDateValid,
        editAuction,
        saveAuction,
        newAuction,
        deleteAuction,
        getBidsForAuction,
        closeBidsDetails,
        scrollToBidsTable,
    };
}