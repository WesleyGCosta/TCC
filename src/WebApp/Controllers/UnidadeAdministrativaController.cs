﻿using Domain.IRepositories;
using Domain.Notifications.Interface;
using Historia.Itens;
using Historia.ParticipantesItens;
using Historia.UnidadesAdministrativas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebApp.Factories;
using WebApp.ViewModels;

namespace WebApp.Controllers
{
    [Authorize]
    public class UnidadeAdministrativaController : BaseController
    {
        private readonly CreateUnidadeAdministrativa _createUnidadeAdministrativa;
        private readonly SearchUnidadeAdministrativa _searchUnidadeAdministrativa;
        private readonly DeleteUnidadeAdministrativa _deleteUnidadeAdministrativa;
        private readonly SearchItem _searchItem;
        private readonly DeleteParticipanteItem _deleteParticipanteItem;
        private readonly SearchParticipanteItem _searchParticipanteItem;
        public UnidadeAdministrativaController(
            IUnidadeAdministrativaRepository unidadeAdministrativaRepository,
            IParticipanteItemRepository participanteItemRepository,
            IItemRepository itemRepository,
            INotifier notifier) : base(notifier)
        {
            _createUnidadeAdministrativa = new CreateUnidadeAdministrativa(unidadeAdministrativaRepository);
            _searchUnidadeAdministrativa = new SearchUnidadeAdministrativa(unidadeAdministrativaRepository);
            _deleteUnidadeAdministrativa = new DeleteUnidadeAdministrativa(unidadeAdministrativaRepository);

            _searchItem = new SearchItem(itemRepository);
            _deleteParticipanteItem = new DeleteParticipanteItem(participanteItemRepository);
            _searchParticipanteItem = new SearchParticipanteItem(participanteItemRepository);
        }

        public IActionResult Create() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(UnidadeAdministrativaViewModel unidadeAdministrativaViewModel)
        {
            if (!ModelState.IsValid)
            {
                return View(unidadeAdministrativaViewModel);
            }

            var unidadeAdministrativa = await _searchUnidadeAdministrativa.GetBySigla(unidadeAdministrativaViewModel.Sigla);
            if (unidadeAdministrativa != null)
            {
                TempData["Warning"] = "Unidade Administrativa com a mesma SIGLA já cadastrado";
                return View(unidadeAdministrativaViewModel);
            }

            unidadeAdministrativa = UnidadeAdministrativaFactory.ToEntityUnidadeAdministrativa(unidadeAdministrativaViewModel);

            await _createUnidadeAdministrativa.Run(unidadeAdministrativa);

            TempData["Success"] = "Unidade Administrativa Cadastrado com Sucesso";

            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> Management()
        {
            var unidadeAdministrativas = await _searchUnidadeAdministrativa.GetAll();
            var listUnidadeAdministrativaViewModel = UnidadeAdministrativaFactory.ToListViewMode(unidadeAdministrativas);
            return View(listUnidadeAdministrativaViewModel);
        }

        public async Task<IActionResult> Details(Guid id)
        {
            var unidadeAdministrativa = await _searchUnidadeAdministrativa.GetById(id);
            if(unidadeAdministrativa == null)
            {
                TempData["Warning"] = "Erro, Unidade Administrativa não encontrada";
                return NotFound();
            }
            var unidadeAdministrativaViewModel = UnidadeAdministrativaFactory.ToViewModel(unidadeAdministrativa);

            return PartialView("_UnidadeAdministrativaDetailsModal", unidadeAdministrativaViewModel);
        }

        [HttpGet]
        public async Task<IActionResult> Delete(Guid unidadeAdministrativaId)
        {
            var unidadeAdmistrativa = await _searchUnidadeAdministrativa.GetById(unidadeAdministrativaId);

            if(unidadeAdmistrativa == null)
            {
                TempData["Warning"] = "Erro ao Excluir Unidade Administrativa";
                return NotFound();
            }

            await _deleteUnidadeAdministrativa.Run(unidadeAdmistrativa);
            TempData["Success"] = "Unidade Administrativa Excluído com Sucesso";

            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> DeleteParticipante(Guid unidadeAdmnistrativaId, Guid itemId)
        {
            var participante = await _searchParticipanteItem.GetByIds(unidadeAdmnistrativaId, itemId);

            return PartialView("rete");
        }

        public async Task<IActionResult> UpdateListParticipanteItem(int yearAta, int codeAta)
        {
            var participantesItens = await _searchItem.GetItemByCodeAtaAndYearAtaIncludeParticipantes(yearAta, codeAta);
            var listParticipantesViewModel = ItemFactory.ToListViewModel(participantesItens);
            return PartialView("_UnidadesAdministrativaEdit", listParticipantesViewModel);
        }
    }
}
