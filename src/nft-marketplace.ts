import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
	ItemBought as ItemBoughtEvent,
	ItemCancelled as ItemCancelledEvent,
	ItemListed as ItemListedEvent,
	ItemUpdated as ItemUpdatedEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
	ActiveItem,
	ItemBought,
	ItemCancelled,
	ItemListed,
	ItemListed,
	ItemUpdated,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
	const itemBoughtId = getIdFromEventParams(
		event.params.tokenId,
		event.params.nftAddress
	);
	let itemBought = ItemBought.load(itemBoughtId);
	let activeItem = ActiveItem.load(itemBoughtId);

	if (!itemBought) {
		itemBought = new ItemBought(itemBoughtId);
	}

	itemBought.buyer = event.params.buyer;
	itemBought.nftAddress = event.params.nftAddress;
	itemBought.tokenId = event.params.tokenId;
	activeItem!.buyer = event.params.buyer;

	itemBought.save();
	activeItem!.save();
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
	const itemCancelledId = getIdFromEventParams(
		event.params.tokenId,
		event.params.nftAddress
	);
	let itemCancelled = ItemCancelled.load(itemCancelledId);
	let activeItem = ActiveItem.load(itemCancelledId);

	if (!itemCancelled) {
		itemCancelled = new ItemCancelled(itemCancelledId);
	}

	itemCancelled.nftAddress = event.params.nftAddress;
	itemCancelled.tokenId = event.params.tokenId;
	activeItem!.buyer = Address.fromString(
		"0x000000000000000000000000000000000000dEaD"
	);

	itemCancelled.save();
	activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
	const itemListedId = getIdFromEventParams(
		event.params.tokenId,
		event.params.nftAddress
	);

	let itemListed = ItemListed.load(itemListedId);
	let activeItem = ActiveItem.load(itemListedId);

	if (!activeItem) {
		activeItem = new ActiveItem(itemListedId);
	}

	if (!itemListed) {
		itemListed = new ItemListed(itemListedId);
	}

	itemListed.seller = event.params.seller;
	activeItem.seller = event.params.seller;

	itemListed.nftAddress = event.params.nftAddress;
	activeItem.nftAddress = event.params.nftAddress;

	itemListed.tokenId = event.params.tokenId;
	activeItem.tokenId = event.params.tokenId;

	itemListed.price = event.params.price;
	activeItem.price = event.params.price;

	itemListed.save();
	activeItem.save();
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
	// let entity = new ItemUpdated(
	// 	event.transaction.hash.concatI32(event.logIndex.toI32())
	// );
	// entity.nftAddress = event.params.nftAddress;
	// entity.tokenId = event.params.tokenId;
	// entity.price = event.params.price;
	// entity.blockNumber = event.block.number;
	// entity.blockTimestamp = event.block.timestamp;
	// entity.transactionHash = event.transaction.hash;
	// entity.save();
}

const getIdFromEventParams = (tokenId: BigInt, nftAddress: Address): string => {
	return tokenId.toHexString() + nftAddress.toHexString();
};
