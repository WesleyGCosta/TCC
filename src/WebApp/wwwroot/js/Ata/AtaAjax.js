﻿import { GetMessageDomain } from '../site.js';

$(document).ready(function () {


    $(document).ajaxStop(function () {
        jQuery.fn.extend({
            trackChanges: function () {
                $(":input", this).change(function () {
                    $(this.form).data("changed", true);
                });
            },
            isChanged: function () {
                return this.data("changed");
            }
        });
    })

    //Select de cadastrar Ata
    $("#AnoAta").change(function () {
        var year = $(this).find("option:selected").val();
        if (year != "") {
            $.ajax({
                type: 'GET',
                url: '/Ata/AutoCompleteNumberAta/',
                data: { yearAta: year },
                success: function (response) {
                    $('#CodigoAta').attr('value', response)
                }
            })
        } else {
            $('#CodigoAta').attr('value', '')
        }
    })

    $('.AnoAtaSelect').change(function () {
        var year = $(this).find("option:selected").val();
        if (year != "") {
            $.ajax({
                type: 'GET',
                url: '/Item/AutoCompleteListCodeAta/',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: { yearAta: year },
                success: function (response) {
                    $('.CodigoAtaSelect').find('option').remove();
                    $('<option>').val("").text("...").appendTo($('.CodigoAtaSelect'))
                    if (response.length > 0) {
                        $.each(response, function (i, d) {
                            $('<option>').val(d).text(d).appendTo($('.CodigoAtaSelect'))
                        })
                    }
                }
            })
        } else {
            cleanSelects();
        }
    })

    $('#CodigoAtaInfo').change(function () {
        var year = $(this).find("option:selected").val();
        if (year != "") {
            $.ajax({
                type: 'GET',
                url: '/Ata/GetAtaByYearAndCode/',
                data: { yearAta: $('#AnoAtaInfo').val(), codeAta: $('#CodigoAtaInfo').val() },
                beforeSend: function () {
                    Loader()
                },
                complete: function () {
                    Finish()
                },
                success: function (response) {
                    fillDivResult(response)
                },
                error: function () {
                    $('#result').empty()
                    GetMessageDomain()
                }
            })
        }
    })

    $('#CodigoAtaEdit').change(function () {
        var yearAta = $(this).find("option:selected").val();
        if (yearAta != "") {
            $.ajax({
                type: 'GET',
                url: '/Ata/GetAtaByYearAndCodeEdit/',
                data: { yearAta: $('#AnoAtaEdit').val(), codeAta: $('#CodigoAtaEdit').val() },
                beforeSend: function () {
                    Loader()
                },
                complete: function () {
                    Finish()
                },
                success: function (response) {
                    fillDivResult(response)
                },
                error: function () {
                    $('#result').empty()
                    GetMessageDomain()
                }
            })
        }
    })


    $("#AnoAtaDelete").change(function () {
        var yearAta = $(this).find("option:selected").val();
        if (yearAta != null) {
            $.ajax({
                type: 'GET',
                url: '/Ata/GetListAtaByYear/',
                data: { yearAta },
                beforeSend: function () {
                    Loader()
                },
                complete: function () {
                    Finish()
                },
                success: function (response) {
                    fillDivResult(response);
                    GetMessageDomain()
                },
                error: function () {
                    $('#result').empty()
                    GetMessageDomain()
                }
            })
        }
    })

    /*exclusão de ata*/

    $(document).on('click', '.deleteAta', function () {
        const codeAta = $(this).attr('data-codeata');
        const yearAta = $(this).attr('data-anoata');

        Swal.fire({
            title: 'Confirmação de Exclusão',
            text: "Essa ação irá excluir tudo relacionado a Ata!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#247ba0',
            cancelButtonColor: '#6c757d',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, apagar ata!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'GET',
                    url: '/Ata/Delete/',
                    data: { yearAta, codeAta },
                    beforeSend: function () {
                        Loader()
                    },
                    complete: function () {
                        Finish()
                    },
                    success: function (response) {
                        GetMessageDomain()
                        fillDivResult(response)
                    },
                    error: function () {
                        $('#result').empty()
                        GetMessageDomain()
                    }
                })    
            }
        })
    })

    //Edição de ata
    $(document).on('submit', '#formAtaEdit', function (event) {
        event.preventDefault();

        if ($(this).valid()) {
            $.ajax({
                type: 'POST',
                url: '/Ata/Edit/',
                data: $(this).serialize(),
                success: function () {
                    GetMessageDomain()
                },
                error: function () {
                    GetMessageDomain()
                }
            })
        }

    })

    function fillDivResult(response) {
        var $container = $("#result");
        $container.html(response)

        $('.modal-backdrop').remove();
        $('body').removeAttr('class')
        $('body').removeAttr('style');
        $container.unbind()
        $container.data("validator", null)
        $.validator.unobtrusive.parse($container);
    }

    function cleanSelects() {
        $('.CodigoAtaSelect').find('option').remove();
        $('<option>').val("").text("...").appendTo($('.CodigoAtaSelect'));
    }
})