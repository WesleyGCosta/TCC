﻿$(document).ready(function () {
    let placeHolderHere = $('#PlaceHolderHere')

    //deletar participante do item
    $(document).on('click', '.btnDeleteDetentora', function () {
        const yearAta = $('#AnoAta').val()
        const codeAta = $('#CodigoAta').val()

        Swal.fire({
            title: 'Confirmação de Exclusão',
            text: "Deseja excluir a Detentora do Item?!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#247ba0',
            cancelButtonColor: '#6c757d',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, apagar Detentoda do Item!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'GET',
                    url: '/Detentora/DeleteDetentoraItem/',
                    data: { detentoraId: $(this).data('detentoraid'), yearAta, codeAta },
                    success: function (response) {
                        $('#detentora').empty()
                        $('#detentora').html(response)
                        GetMessageDomain()
                    }
                })
            }
        })
    })

    $('.btnOption').click(function () {
        let status = (this.value == 'true')
        GetDetentorasByStatus(status)
    })


    function GetDetentorasByStatus(status) {
        $.ajax({
            type: 'GET',
            url: '/Detentora/GetDetentorasByStatus/',
            data: { status },
            success: function (response) {
                FillListUnidadeAdministrativa(response, status)
                GetMessageDomain()
            }
        })
    }

    function FillListUnidadeAdministrativa(response, status) {
        if (status == true) {
            $('#listDetentorasActive').empty()
            $('#listDetentorasActive').append(response)
        }
        else {
            $('#listDetentorasInactive').empty()
            $('#listDetentorasInactive').append(response)
        }
    }

    $(document).on('click', 'button[data-toggle="update"]', function () {

        let status = (this.value == 'true');
        let name = $(this).parent().data('name');

        let mensagem = '';
        if (status == true) {
            mensagem = "Ativar"
        } else {
            mensagem = "Desativar"
        }

        Swal.fire({
            title: 'Confirmação',
            text: `Deseja ${mensagem} a Detentora ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#247ba0',
            cancelButtonColor: '#6c757d',
            cancelButtonText: 'Cancelar',
            confirmButtonText: `Sim, ${mensagem}!`
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: '/Detentora/UpdateStatus/',
                    data: { id: $(this).parent().data('detentoraid'), status },
                    success: function (response) {
                        FillListUnidadeAdministrativa(response, !status)
                        GetMessageDomain()
                    }
                })
            }
        })
    })


    //Detalhes de detantoras
    $(document).on('click', 'button[data-toggle="ajax-modal-infoDetentora"]', function () {
        $.ajax({
            type: 'GET',
            url: '/Detentora/Details/',
            data: { id: $(this).parent().data('detentoraid') },
            success: function (response) {
                placeHolderHere.empty()
                placeHolderHere.html(response)
                placeHolderHere.find('.modal').modal('show');
            }
        })
    })

    //Editar Detentora (GET)
    $(document).on('click', 'button[data-toggle="ajax-modal-editDetentora"]', function () {
        $.ajax({
            type: 'GET',
            url: '/Detentora/Edit/',
            data: { id: $(this).parent().data('detentoraid') },
            success: function (response) {
                placeHolderHere.empty()
                placeHolderHere.html(response)
                placeHolderHere.unbind()
                placeHolderHere.data("validator", null)
                $.validator.unobtrusive.parse(placeHolderHere);

                placeHolderHere.find('.modal').modal('show');
            }
        })
    })

    //Editar Detentora (POST)
    $(document).on('submit', '#formEditDetentora', function (e) {
        e.preventDefault()

        if ($(this).valid()) {
            $.ajax({
                type: 'POST',
                url: '/Detentora/Edit/',
                data: $(this).serialize(),
                success: function (response) {
                    $('.listDetentora').empty()
                    $('.listDetentora').append(response)
                    GetMessageDomain()
                    placeHolderHere.find('.modal').modal('hide');
                },
                error: function () {
                    GetMessageDomain()
                }
            })
        }
        
    })
})

export function UpdateListDetentora(yearAta, codeAta) {
        $.ajax({
            type: 'GET',
            url: '/Detentora/UpdateListDetentora/',
            data: { yearAta, codeAta },
            success: function (response) {
                $('#detentora').empty()
                $('#detentora').html(response)
            }
        })
    }