﻿using Domain.Enums;
using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class UnidadeAdministrativa
    {
        public UnidadeAdministrativa(
            Guid id, 
            string nomeUnidadeAdministrativa, 
            string sigla, 
            bool orgaoEx, 
            string unidadeDaFederacao, 
            EhEsferaAdministrativa esferaAdministrativa, 
            bool ativo)
        {
            Id = id;
            NomeUnidadeAdministrativa = nomeUnidadeAdministrativa;
            Sigla = sigla;
            OrgaoEx = orgaoEx;
            UnidadeDaFederacao = unidadeDaFederacao;
            EsferaAdministrativa = esferaAdministrativa;
            Ativo = ativo;
        }

        public Guid Id { get; private set; }
        public string NomeUnidadeAdministrativa { get; private set; }
        public string Sigla { get; private set; }
        public bool OrgaoEx { get; private set; }
        public string UnidadeDaFederacao { get; private set; }
        public EhEsferaAdministrativa EsferaAdministrativa { get; private set; }
        public bool Ativo { get; private set; }

        public IEnumerable<ParticipanteItem> ParticipantesItens { get; private set; }
    }
}