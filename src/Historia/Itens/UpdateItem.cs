﻿using Domain.Entities;
using Domain.IRepositories;
using System;
using System.Threading.Tasks;

namespace Historia.Itens
{
    public class UpdateItem
    {
        private readonly IItemRepository _itemRepository;

        public UpdateItem(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        public async Task Run(Item item)
        {
            var itemConsult = await _itemRepository.GetByPrimaryKey(item.Id);

            itemConsult.Update(item);
            await _itemRepository.Update(itemConsult);
        }

        public async Task SubtractQuantityItem(Guid itemId, int programacaoConsumo)
        {
            var item = await _itemRepository.GetByPrimaryKey(itemId);
            item.SubtractQuantityItem(programacaoConsumo);
            await _itemRepository.Update(item);
        }

        public async Task Renumber(int yearAta, int codeAta, int numberItem)
        {
            var itensConsult = await _itemRepository.GetItensAfterNumber(yearAta, codeAta, numberItem);
            foreach(var item in itensConsult)
            {
                item.Renumber(numberItem);
                await _itemRepository.Update(item);
                numberItem++;
            }

        }

        public async Task ActiveInactiveItem(Item item, bool status)
        {
            item.ActiveInactiveItem(status);
            await _itemRepository.Update(item);
        }

        public async Task RealignPrice(decimal precoMercado, decimal precoRegistrado, Item item)
        {
            item.RealignPrice(precoMercado, precoRegistrado);
            await _itemRepository.Update(item);
        }
    }
}
