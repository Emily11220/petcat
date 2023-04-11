from django.shortcuts import render, get_object_or_404
from .models import FoodDetail
# Create your views here.


def home(request):
    return render(request, 'group14_app/homepage.html')


def list(request):
    food_waste_list = [
        {   
            'type': 'Household waste',
            'description': 'This is the food waste that occurs in our homes, including food that is left uneaten on plates, expired or spoiled food, and food that is thrown away because it is no longer wanted.',
            'id':'1'
        },
        {
            'type': 'Retail waste',
            'description': 'This includes food that is thrown away by supermarkets, grocery stores, and other food retailers due to overstocking, expiration, or damage.',
            'id':'2'
        },
        {
            'type': 'Restaurant waste',
            'description': 'This is the food waste that occurs in restaurants, cafes, and other food service establishments, including food that is left uneaten by customers, overproduction, and spoilage.',
            'id':'3'
        },
        {
            'type': 'Agricultural waste',
            'description': 'This includes food that is lost during the production and harvesting of crops, such as fruits and vegetables that are left in the field due to overproduction or damage.', 
            'id':'4'
        },
        {
            'type': 'Processing waste',
            'description': 'This is the food waste that occurs during the processing and manufacturing of food products, including scraps, trimmings, and packaging waste.', 
            'id':'5'
        },
        {
            'type': 'Transportation and distribution waste',
            'description': 'This includes food that is lost during transportation and distribution, such as spoilage and damage during transit.',
            'id':'6'
        },
    ]
    
    return render(request, 'group14_app/list.html', {'list': food_waste_list} )


def details(request, id):
    food_waste_list = get_object_or_404(FoodDetail, id=id)

    context={'food_waste_list':food_waste_list,
             }
    return render(request, 'group14_app/details.html', context)


def data_model(request):
    return render(request, 'group14_app/data-model.html')