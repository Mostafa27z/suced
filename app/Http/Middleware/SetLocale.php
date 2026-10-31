<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->get('lang');

        if ($locale && in_array($locale, ['en', 'ar'])) {
            Session::put('locale', $locale);

            if ($request->user()) {
                $request->user()->update(['locale' => $locale]);
            }
        } elseif (Session::has('locale')) {
            $locale = Session::get('locale');
        } elseif ($request->user() && $request->user()->locale) {
            $locale = $request->user()->locale;
            Session::put('locale', $locale);
        } else {
            $locale = config('app.locale', 'en');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
