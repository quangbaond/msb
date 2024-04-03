(function ($, window) {
  var urlSheet =
    "https://script.google.com/macros/s/AKfycbxrxHjCu1fVdalcNiWTVVaT1v8eCa9KbrC-c6UeKOPYHESFGlU14T8EWGiO7M-orh6qRA/exec";

  $(".banner_slider").slick({
    dots: true,
    arrows: false,
    speed: 500,
    fade: true,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 10000,
  });

  $(".pack_list").slick({
    infinite: false,
    dots: false,
    arrows: false,
    slidesToShow: 2,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.25,
          slidesToScroll: 1,
        },
      },
    ],
  });

  var tabs_scroll = $("#tabs_scroll");

  $(window).on("load resize", function () {
    if ($(window).width() >= 992) {
      if (tabs_scroll.hasClass("slick-slider")) {
        $("#tabs_scroll").slick("unslick");
      }
    } else {
      if (!tabs_scroll.hasClass("slick-slider")) {
        tabs_scroll.slick({
          infinite: false,
          dots: false,
          arrows: false,
          slidesToShow: 2.3,
          slidesToScroll: 2,
        });
      }
    }
  });

  $(".nav-link").on("click", function () {
    $(this).parents(".nav-tabs").find(".nav-link").removeClass("active");
  });

  // hiệu ứng cho input range
  var cost_saving = $(".cost_saving");

  // xử lý ô nhập kéo giá trị
  function handleInputChange(e) {
    let target = e.target;

    const min = target.min;
    const max = target.max;
    const val = target.value;

    $(target).css(
      "background-size",
      ((val - min) * 100) / (max - min) + "% 100%"
    );
  }

  // xử lý ô nhập text giá trị
  function formatNumber(value) {
    value = value.toString().replace(/^0+/, "");
    var parts = [];

    while (value.length > 3) {
      parts.unshift(value.substr(value.length - 3));
      value = value.substr(0, value.length - 3);
    }
    parts.unshift(value);
    return parts.join(".");
  }

  // thực hiện kéo thả range input
  cost_saving.find('input[type="range"]').on("input", function (e) {
    handleInputChange(e);

    let valueRange = $(this).val();
    if ($(this).val() == 0) {
      let inputText = $(this)
        .parents(".input_group")
        .find('input[type="text"]');

      if (inputText.hasClass("input1")) {
        inputText.val("1");
      } else if (inputText.hasClass("input2")) {
        inputText.val("1");
      } else if (inputText.hasClass("input3")) {
        inputText.val("1.000");
      } else if (inputText.hasClass("input4")) {
        inputText.val("1");
      } else if (inputText.hasClass("input5")) {
        inputText.val("1.000");
      }
    } else {
      let value = formatNumber(Number(valueRange));
      $(this).parents(".input_group").find('input[type="text"]').val(value);
    }
  });

  var totalA = 0;
  var totalB = 0;
  var totalD = 0;
  var rateUSD = 23000;

  cost_saving.find('input[type="text"]').on("input change", function () {
    var value = $(this).val();
    value = value.replace(/[^0-9]/g, "");

    // Giới hạn độ dài tối đa là 10 ký tự
    if ($(this).hasClass("input3")) {
      var maxLength = 8;
      if (value > 10000000) {
        value = 10000000;
      }
    } else if ($(this).hasClass("input5")) {
      var maxLength = 8;
      if (value > 10000000) {
        value = 10000000;
      }
    }

    if (value.length > maxLength) {
      value = value.substr(0, maxLength);
    }

    var formattedValue = formatNumber(value);
    $(this).val(formattedValue);

    formCalculate();
  });

  // check validate
  cost_saving.find('input[type="text"]').on("change input", function () {
    if (!$(this).val()) {
      $(this).val("0");
    }

    let inputRange = $(this)
      .parents(".input_group")
      .find('input[type="range"]');
    inputRange.val(Number($(this).val().replace(/\./g, "")));

    const min = inputRange.attr("min");
    const max = inputRange.attr("max");
    const val = inputRange.val();

    $(inputRange).css(
      "background-size",
      ((val - min) * 100) / (max - min) + "% 100%"
    );
  });

  formCalculate();

  cost_saving.find('input[type="range"]').on("input change", function () {
    formCalculate();
  });

  cost_saving.find(".type_currency > select").on("change", formCalculate);

  function formCalculate() {
    // tính toán công thức
    var input1 = cost_saving.find('input[name="input1"]').val()
      ? $('input[name="input1"]').val().replace(/\./g, "")
      : 0;
    var input2 = cost_saving.find('input[name="input2"]').val()
      ? $('input[name="input2"]').val().replace(/\./g, "")
      : 0;
    var input3 = cost_saving.find('input[name="input3"]').val()
      ? $('input[name="input3"]').val().replace(/\./g, "")
      : 0;
    var input4 = cost_saving.find('input[name="input4"]').val()
      ? $('input[name="input4"]').val().replace(/\./g, "")
      : 0;

    // tổng giao dịch của giao hang tiet kiem
    totalA = parseFloat(
      Number(input1) * 15000 * 0.15 + Number(input2) * 30000 * 0.3
    );
    $(".tiet_kiem_giaohangtietkiem").text(
      totalA.toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
      })
    );

    // hàm tính 2
    var dien_phi = 0.002 * Number(input3);
    totalB = parseFloat(dien_phi * rateUSD * Number(input4));

    if (totalB == 0) {
      totalB = 0;
    } else if (totalB <= rateUSD * 10) {
      totalB = rateUSD * 10;
    } else if (totalB >= rateUSD * 500) {
      totalB = rateUSD * 500 * Number(input4);
    }

    $(".tiet_kiem_quoc_te").text(
      totalB.toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
      })
    );

    var tong_tiet_kiem_chi_phi = totalA + totalB;

    $(".total_tiet_kiem").text(
      tong_tiet_kiem_chi_phi.toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
      })
    );

    var input5 = cost_saving.find('input[name="input5"]').val()
      ? $('input[name="input5"]').val().replace(/\./g, "")
      : 0;

    var type_currency = $(".type_currency > select").val();

    if (type_currency == "JPY") {
      totalD = Number(input5) * 0.6;
    } else {
      totalD = Number(input5) * 100;
    }

    $(".totalD").text(
      totalD.toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
      })
    );
  }

  $(".phone_icon").click(function () {
    if ($(window).width() >= 992) {
      $(".phone_list").toggle(500);
    } else {
      $(".phone_list").toggle(100);
    }
  });

  new WOW().init();

  // form thu lead

  function validateForm({ ho_ten, so_dien_thoai, ma_so_thue, i_agree }) {
    let checkVali = false;

    // hiển thị thông báo lỗi
    if (!ho_ten.val()) {
      toggleErrMess(ho_ten);
    }

    // validate số điện thoại
    if (!so_dien_thoai.val()) {
      $(".errNull", so_dien_thoai.parents(".input_group")).show();
      $(".errVali", so_dien_thoai.parents(".input_group")).hide();
    } else if (!/^\d{10}$/.test(so_dien_thoai.val())) {
      $(".errVali", so_dien_thoai.parents(".input_group")).show();
      $(".errNull", so_dien_thoai.parents(".input_group")).hide();
    }

    if (!ma_so_thue.val()) {
      $(".errNull", ma_so_thue.parents(".input_group")).show();
      $(".errVali", ma_so_thue.parents(".input_group")).hide();
    } else if (!/^\d{10}(?:\d{3})?$/.test(ma_so_thue.val())) {
      $(".errVali", ma_so_thue.parents(".input_group")).show();
      $(".errNull", ma_so_thue.parents(".input_group")).hide();
    }

    if (!i_agree.is(":checked")) {
      toggleErrMess(i_agree);
    }

    // kiểm tra validate khi submit form
    if (!ho_ten.val()) {
      checkVali = false;
    } else if (!so_dien_thoai.val()) {
      checkVali = false;
    } else if (!/^0\d{9}$/.test(so_dien_thoai.val())) {
      checkVali = false;
    } else if (!ma_so_thue.val()) {
      checkVali = false;
    } else if (!/^\d{10}(?:\d{3})?$/.test(ma_so_thue.val())) {
      checkVali = false;
	} else if (!i_agree.is(":checked")) {
      checkVali = false;
    } else {
      checkVali = true;
    }

    return checkVali;
  }

  function submitForm({
    formElement,
    ho_ten,
    ma_so_thue,
    dia_chi,
    so_dien_thoai,
    i_agree,
    sending,
  }) {
    formElement.submit(function (event) {
      event.preventDefault();

      const queryParam = JSON.parse(window.localStorage.getItem("utm_data"));
      var utmId = queryParam?.utm_id;
      var utmSource = queryParam?.utm_source;
      var utmMedium = queryParam?.utm_medium;
      var utmCampaign = queryParam?.utm_campaign;
      var utmTerm = queryParam?.utm_term;
      var utmContent = queryParam?.utm_content;

      var data = formElement.serialize();
      if (utmId) {
        data = data + "&utm_id=" + utmId;
      }
      if (utmSource) {
        data = data + "&utm_source=" + utmSource;
      }
      if (utmMedium) {
        data = data + "&utm_medium=" + utmMedium;
      }
      if (utmCampaign) {
        data = data + "&utm_campaign=" + utmCampaign;
      }
      if (utmTerm) {
        data = data + "&utm_term=" + utmTerm;
      }
      if (utmContent) {
        data = data + "&utm_content=" + utmContent;
      }

      const checkVali = validateForm({
        ho_ten,
        so_dien_thoai,
        ma_so_thue,
        i_agree,
      });

      if (sending) {
        $(".get_advice_now").addClass("btn_sending");
        event.preventDefault();
      }

      if (checkVali && !sending) {
        sending = true;
        $(".get_advice_now").addClass("btn_sending");

        $.ajax({
          type: "GET",
          url: urlSheet,
          dataType: "json",
          crossDomain: true,
          data: data,
          success: function (data) {
            $(".custom-model-main").addClass("model-open");
            formElement.find('input[type="text"]').val("");
            dia_chi.val("Hà Nội").trigger("change");
            $(".pop-up-porlet-main").hide();
          },
          error: function () {
            alert("Đăng ký không thành công !");
          },
          complete: function () {
            $(".get_advice_now").removeClass("btn_sending");
            sending = false;
          },
        });
      }
    });
  }
  var form_thu_lead = $("#consultant-form");
  var ho_ten = form_thu_lead.find('input[name="ho_ten"]');
  var so_dien_thoai = form_thu_lead.find('input[name="so_dien_thoai"]');
  var dia_chi = form_thu_lead.find('select[name="dia_chi"]');
  var ma_so_thue = form_thu_lead.find('input[name="ma_so_thue"]');
  var i_agree = form_thu_lead.find("#i_agree");

  var sending = false;
  submitForm({
    formElement: form_thu_lead,
    ho_ten,
    so_dien_thoai,
    ma_so_thue,
    dia_chi,
    i_agree,
    sending,
  });
  // ẩn thông báo lỗi
  form_thu_lead.find('input[type="text"]').on("change", function () {
    if ($(this).val()) {
      $(this).parents(".input_group").find(".err").hide();
    }
  });

  i_agree.on("change", function () {
    if ($(this).is(":checked")) {
      $(this).parents(".input_group").find(".err").hide();
    }
  });

  // form thu lead

  var consultant_form_popup = $("#consultant-form-popup");
  var sending_popup = false;

  var ho_ten_popup = consultant_form_popup.find('input[name="ho_ten"]');
  var so_dien_thoai_popup = consultant_form_popup.find(
    'input[name="so_dien_thoai"]'
  );
  var dia_chi_popup = consultant_form_popup.find('select[name="dia_chi"]');
  var ma_so_thue_popup = consultant_form_popup.find('input[name="ma_so_thue"]');
  var i_agree_popup = consultant_form_popup.find("#i_agree_popup");

  submitForm({
    formElement: consultant_form_popup,
    ho_ten: ho_ten_popup,
    so_dien_thoai: so_dien_thoai_popup,
    ma_so_thue: ma_so_thue_popup,
    dia_chi: dia_chi_popup,
    i_agree: i_agree_popup,
    sending: sending_popup,
  });
  // ẩn thông báo lỗi
  consultant_form_popup.find('input[type="text"]').on("change", function () {
    if ($(this).val()) {
      $(this).parents(".input_group").find(".err").hide();
    }
  });

  i_agree_popup.on("change", function () {
    if ($(this).is(":checked")) {
      $(this).parents(".input_group").find(".err").hide();
    }
  });

  function toggleErrMess(input) {
    input.parents(".input_group").find(".err").show();
  }

  // close thông báo thành công
  $(".btn_back_form, .bg-overlay").click(function () {
    $(".custom-model-main").removeClass("model-open");
  });

  // cuộn trang
  $("a.register_now").on("click", function (event) {
    event.preventDefault();
    var hash = this.hash;
    scrollSmooth(hash);
  });

  if (window.location.hash) {
    scrollSmooth(window.location.hash);
  }

  function scrollSmooth(target) {
    var targetElement = $(target);
    if (targetElement.length > 0) {
      let addHeight = 0;
      if (target == "#formdienthongtin" && $(window).width() < 992) {
        addHeight = addHeight + targetElement.find(".form_cta").height();
      }

      $("html, body").animate(
        {
          scrollTop: targetElement.offset().top - 80 + addHeight,
        },
        1000
      );
    }
  }

  $("select").select2({
    minimumResultsForSearch: -1,
  });

  // 64 tỉnh thành
  var tinhThanhVietNam = [
    { id: 1, text: "An Giang" },
    { id: 2, text: "Bà Rịa - Vũng Tàu" },
    { id: 3, text: "Bạc Liêu" },
    { id: 4, text: "Bắc Giang" },
    { id: 5, text: "Bắc Kạn" },
    { id: 6, text: "Bắc Ninh" },
    { id: 7, text: "Bến Tre" },
    { id: 8, text: "Bình Dương" },
    { id: 9, text: "Bình Định" },
    { id: 10, text: "Bình Phước" },
    { id: 11, text: "Bình Thuận" },
    { id: 12, text: "Cà Mau" },
    { id: 13, text: "Cao Bằng" },
    { id: 14, text: "Cần Thơ" },
    { id: 15, text: "Đà Nẵng" },
    { id: 16, text: "Đắk Lắk" },
    { id: 17, text: "Đắk Nông" },
    { id: 18, text: "Điện Biên" },
    { id: 19, text: "Đồng Nai" },
    { id: 20, text: "Đồng Tháp" },
    { id: 21, text: "Gia Lai" },
    { id: 22, text: "Hà Giang" },
    { id: 23, text: "Hà Nam" },
    { id: 24, text: "Hà Nội" },
    { id: 25, text: "Hà Tĩnh" },
    { id: 26, text: "Hải Dương" },
    { id: 27, text: "Hải Phòng" },
    { id: 28, text: "Hậu Giang" },
    { id: 29, text: "Hòa Bình" },
    { id: 30, text: "Hưng Yên" },
    { id: 31, text: "Khánh Hòa" },
    { id: 32, text: "Kiên Giang" },
    { id: 33, text: "Kon Tum" },
    { id: 34, text: "Lai Châu" },
    { id: 35, text: "Lâm Đồng" },
    { id: 36, text: "Lạng Sơn" },
    { id: 37, text: "Lào Cai" },
    { id: 38, text: "Long An" },
    { id: 39, text: "Nam Định" },
    { id: 40, text: "Nghệ An" },
    { id: 41, text: "Ninh Bình" },
    { id: 42, text: "Ninh Thuận" },
    { id: 43, text: "Phú Thọ" },
    { id: 44, text: "Phú Yên" },
    { id: 45, text: "Quảng Bình" },
    { id: 46, text: "Quảng Nam" },
    { id: 47, text: "Quảng Ngãi" },
    { id: 48, text: "Quảng Ninh" },
    { id: 49, text: "Quảng Trị" },
    { id: 50, text: "Sóc Trăng" },
    { id: 51, text: "Sơn La" },
    { id: 52, text: "Tây Ninh" },
    { id: 53, text: "Thái Bình" },
    { id: 54, text: "Thái Nguyên" },
    { id: 55, text: "Thanh Hóa" },
    { id: 56, text: "Thừa Thiên Huế" },
    { id: 57, text: "Tiền Giang" },
    { id: 58, text: "TP Hồ Chí Minh" },
    { id: 59, text: "Trà Vinh" },
    { id: 60, text: "Tuyên Quang" },
    { id: 61, text: "Vĩnh Long" },
    { id: 62, text: "Vĩnh Phúc" },
    { id: 63, text: "Yên Bái" },
  ];

  dia_chi
    .select2({
      data: tinhThanhVietNam.map(function (item) {
        return {
          id: item.text,
          text: item.text,
        };
      }),
      minimumResultsForSearch: -1,
    })
    .val("Hà Nội")
    .trigger("change");

  dia_chi_popup
    .select2({
      data: tinhThanhVietNam.map(function (item) {
        return {
          id: item.text,
          text: item.text,
        };
      }),
      minimumResultsForSearch: -1,
    })
    .val("Hà Nội")
    .trigger("change");
  $('input[name="so_dien_thoai"]').on("input", function () {
    var inputValue = $(this).val().trim();
    var maxLength = $(this).attr("name") === "so_dien_thoai" ? 10 : 13;
    var numbersOnly = /^\d+$/;
    var previousValue = $(this).data("previous-value") || "";

    if (!numbersOnly.test(inputValue) && inputValue !== "") {
      $(this).val(previousValue);
      return false;
    }

    if (inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength);
      $(this).val(inputValue);
    }

    $(this).data("previous-value", inputValue);
  });

  // Get UTM
  // function getUrlParameter(sParam) {
  //   var sPageURL = window.location.search.substring(1),
  //     sURLVariables = sPageURL.split("&"),
  //     sParameterName,
  //     i;

  //   for (i = 0; i < sURLVariables.length; i++) {
  //     sParameterName = sURLVariables[i].split("=");

  //     if (sParameterName[0] === sParam) {
  //       return sParameterName[1] === undefined
  //         ? true
  //         : decodeURIComponent(sParameterName[1]);
  //     }
  //   }
  //   return false;
  // }

  // function compareValue(key) {
  //   var utm_val = localStorage.getItem(key) || "";
  //   var utm_param = getUrlParameter(key) || "";

  //   if (utm_val && utm_param && utm_val !== utm_param) {
  //     utm_val = utm_param;
  //   } else if (!utm_val) {
  //     localStorage.setItem(key, utm_param);
  //     utm_val = utm_param;
  //   }

  //   return utm_val;
  // }

  // var utm_campaign = compareValue("utm_campaign");
  // var utm_medium = compareValue("utm_medium");
  // var utm_source = compareValue("utm_source");

  // $('input[name="utm_campaign"]').val(utm_campaign);
  // $('input[name="utm_medium"]').val(utm_medium);
  // $('input[name="utm_source"]').val(utm_source);
})(jQuery, window);
